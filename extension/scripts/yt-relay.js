// YouTube downloads that run on the user's own connection (loaded by pages/offscreen.html).
//
// 1. Relay: the server runs yt-dlp but performs every YouTube request through this
//    WebSocket, so YouTube only ever sees the user's IP (no "confirm you're not a bot"),
//    and the stream URLs it returns are locked to this browser's IP.
// 2. Download: fetch the video/audio streams directly from googlevideo in ranged chunks
//    into OPFS (disk), never holding whole files in memory.
// 3. Merge/convert with the bundled ffmpeg.wasm, then hand a blob URL to background.js,
//    which saves it with chrome.downloads and asks us to clean up afterwards.
import { FFmpeg } from '../vendor/ffmpeg/ffmpeg/index.js';

// Must match YT_RELAY_ALLOWED_HOSTS in backend/main.py. The server decides which URLs to
// fetch, so this allowlist is what stops it from using the browser to reach anything else.
const RELAY_HOSTS = ['youtube.com', 'youtu.be', 'googlevideo.com', 'youtubei.googleapis.com', 'ytimg.com'];
const MEDIA_HOSTS = ['googlevideo.com'];
const RELAY_METHODS = ['GET', 'POST', 'HEAD'];
const MAX_RELAY_BODY = 8 * 1024 * 1024;
const DEFAULT_CHUNK = 10 * 1024 * 1024; // YouTube throttles unranged downloads
const CHUNK_CONCURRENCY = 3;
const CHUNK_RETRIES = 3;
// ffmpeg.wasm holds its output in wasm memory (max ~2 GB), so bigger merges go to the server.
const MAX_MERGE_BYTES = 1.5 * 1024 * 1024 * 1024;
const DIR_PREFIX = 'yt-';
const FORBIDDEN_HEADERS = new Set([
    'cookie', 'host', 'connection', 'content-length', 'accept-encoding', 'origin', 'referer',
    'user-agent', 'te', 'keep-alive', 'transfer-encoding', 'upgrade', 'via', 'expect', 'trailer',
]);
// Errors where retrying on the server can't help.
const NO_FALLBACK_CODES = new Set(['signin', 'live', 'bad_url', 'busy', 'connect', 'unavailable', 'bad_request']);

const jobs = new Map();

class JobError extends Error {
    constructor(code, message, fallback = !NO_FALLBACK_CODES.has(code)) {
        super(message);
        this.code = code;
        this.fallback = fallback;
    }
}

function hostAllowed(url, hosts) {
    try {
        const { protocol, hostname } = new URL(url);
        return protocol === 'https:' && hosts.some(h => hostname === h || hostname.endsWith(`.${h}`));
    } catch {
        return false;
    }
}

function report(jobId, update) {
    chrome.runtime.sendMessage({ action: 'YT_RELAY_PROGRESS', jobId, ...update }).catch(() => {});
}

function bytesToBase64(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
}

function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

function safeFilename(title, ext) {
    const base = String(title || 'YouTube video')
        .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
        .replace(/\s+/g, ' ')
        .replace(/^[.\s]+|[.\s]+$/g, '')
        .slice(0, 150) || 'YouTube video';
    return `${base}.${ext}`;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ---- 1. relay -----------------------------------------------------------------------

async function relayFetch(message, signal) {
    const base = { type: 'fetch_result', id: message.id };
    if (!hostAllowed(message.url, RELAY_HOSTS) || !RELAY_METHODS.includes(message.method)) {
        return { ...base, ok: false, error: 'Blocked by the extension relay policy.' };
    }
    const headers = new Headers();
    for (const [name, value] of Object.entries(message.headers || {})) {
        const lower = name.toLowerCase();
        if (FORBIDDEN_HEADERS.has(lower) || lower.startsWith('sec-') || lower.startsWith('proxy-')) continue;
        try { headers.set(name, value); } catch { /* invalid header value */ }
    }
    try {
        // credentials:'omit' keeps the user's YouTube account out of it: the server only
        // ever sees what a signed-out visitor would get.
        const response = await fetch(message.url, {
            method: message.method,
            headers,
            body: message.body ? base64ToBytes(message.body) : undefined,
            credentials: 'omit',
            cache: 'no-store',
            redirect: 'follow',
            signal,
        });
        if (!hostAllowed(response.url, RELAY_HOSTS)) {
            return { ...base, ok: false, error: 'Redirected outside YouTube.' };
        }
        if (Number(response.headers.get('content-length') || 0) > MAX_RELAY_BODY) {
            return { ...base, ok: false, error: 'Response too large to relay.' };
        }
        const body = new Uint8Array(await response.arrayBuffer());
        if (body.length > MAX_RELAY_BODY) {
            return { ...base, ok: false, error: 'Response too large to relay.' };
        }
        return {
            ...base,
            ok: true,
            status: response.status,
            url: response.url,
            headers: Object.fromEntries(response.headers),
            body: bytesToBase64(body),
        };
    } catch (error) {
        if (signal.aborted) throw error;
        return { ...base, ok: false, error: error.message || 'Network error' };
    }
}

function extractLinks(job, params) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(params.wsUrl);
        let settled = false;
        const finish = (settle, value) => {
            if (settled) return;
            settled = true;
            try { ws.close(); } catch { /* already closed */ }
            settle(value);
        };
        job.abort.signal.addEventListener('abort', () => finish(reject, new DOMException('Cancelled', 'AbortError')));

        ws.onopen = () => ws.send(JSON.stringify({
            type: 'start', token: params.token, url: params.url, kind: params.kind, height: params.height,
        }));
        ws.onmessage = async (event) => {
            let message;
            try { message = JSON.parse(event.data); } catch { return; }
            if (message.type === 'fetch') {
                const result = await relayFetch(message, job.abort.signal).catch(() => null);
                if (result && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(result));
            } else if (message.type === 'result') {
                finish(resolve, message);
            } else if (message.type === 'error') {
                finish(reject, new JobError(message.code, message.message));
            }
        };
        ws.onerror = () => finish(reject, new JobError('connect', 'Could not connect to the RightMate server.'));
        ws.onclose = () => finish(reject, new JobError('closed', 'The server closed the connection.'));
    });
}

// ---- 2. download --------------------------------------------------------------------

async function fetchRange(job, url, start, end) {
    for (let attempt = 1; ; attempt++) {
        try {
            const response = await fetch(url, {
                headers: { Range: `bytes=${start}-${end}` },
                credentials: 'omit',
                cache: 'no-store',
                signal: job.abort.signal,
            });
            if (response.status !== 206 && !(response.status === 200 && start === 0)) {
                throw new JobError('download', `YouTube refused the download (HTTP ${response.status}).`);
            }
            const total = response.status === 200
                ? null
                : Number((response.headers.get('content-range') || '').split('/')[1]) || null;
            const bytes = new Uint8Array(await response.arrayBuffer());
            return { bytes, total: total ?? (response.status === 200 ? bytes.length : null) };
        } catch (error) {
            if (job.abort.signal.aborted || attempt >= CHUNK_RETRIES) throw error;
            await sleep(1000 * attempt);
        }
    }
}

async function downloadStream(job, stream, fileHandle, onProgress) {
    const chunk = stream.chunk_size || DEFAULT_CHUNK;
    const writable = await fileHandle.createWritable();
    try {
        const first = await fetchRange(job, stream.url, 0, chunk - 1);
        const total = first.total ?? first.bytes.length;
        await writable.write({ type: 'write', position: 0, data: first.bytes });
        onProgress(first.bytes.length, total);

        const ranges = [];
        for (let start = first.bytes.length; start < total; start += chunk) {
            ranges.push([start, Math.min(start + chunk, total) - 1]);
        }
        let next = 0;
        const worker = async () => {
            while (next < ranges.length) {
                const [start, end] = ranges[next++];
                const part = await fetchRange(job, stream.url, start, end);
                if (part.bytes.length !== end - start + 1) {
                    throw new JobError('download', 'YouTube sent an incomplete part of the video.');
                }
                await writable.write({ type: 'write', position: start, data: part.bytes });
                onProgress(part.bytes.length, total);
            }
        };
        await Promise.all(Array.from({ length: Math.min(CHUNK_CONCURRENCY, ranges.length) }, worker));
        await writable.close();
    } catch (error) {
        await writable.abort().catch(() => {});
        throw error;
    }
}

// ---- 3. merge / convert -------------------------------------------------------------

function outputPlan(result) {
    const { kind, streams } = result;
    if (kind === 'mp3') return { ext: 'mp3', ffmpeg: true };
    if (streams.length === 1) return { ext: streams[0].ext || kind, ffmpeg: false };
    const video = streams.find(s => s.vcodec && s.vcodec !== 'none') || streams[0];
    const audio = streams.find(s => s !== video) || streams[1];
    const webmOk = /^(vp0?8|vp0?9|av01)/.test(video.vcodec || '') && /^(opus|vorbis)/.test(audio.acodec || '');
    // WebM was requested but only H.264/AAC exist at that quality: MP4 is the container that fits.
    return { ext: kind === 'webm' && !webmOk ? 'mp4' : kind, ffmpeg: true };
}

async function runFfmpeg(job, result, inputFiles, outName, onProgress) {
    const ffmpeg = new FFmpeg();
    job.ffmpeg = ffmpeg;
    await ffmpeg.load({
        coreURL: chrome.runtime.getURL('vendor/ffmpeg/core/ffmpeg-core.js'),
        wasmURL: chrome.runtime.getURL('vendor/ffmpeg/core/ffmpeg-core.wasm'),
    });
    ffmpeg.on('progress', ({ progress }) => {
        if (progress >= 0 && progress <= 1) onProgress(Math.round(progress * 100));
    });
    // WORKERFS reads the OPFS files lazily instead of copying them into wasm memory.
    await ffmpeg.createDir('/in');
    await ffmpeg.mount('WORKERFS', { files: inputFiles }, '/in');
    const inputs = inputFiles.flatMap(file => ['-i', `/in/${file.name}`]);
    let args;
    if (result.kind === 'mp3') {
        args = [...inputs, '-vn', '-c:a', 'libmp3lame', '-b:a', '192k', outName];
    } else {
        const videoIndex = Math.max(0, result.streams.findIndex(s => s.vcodec && s.vcodec !== 'none'));
        args = [...inputs, '-map', `${videoIndex}:v:0`, '-map', `${1 - videoIndex}:a:0`, '-c', 'copy', outName];
    }
    const code = await ffmpeg.exec(args);
    if (code !== 0) {
        throw new JobError('merge', result.kind === 'mp3' ? 'Converting to MP3 failed.' : 'Merging video and audio failed.');
    }
    const data = await ffmpeg.readFile(outName);
    ffmpeg.terminate();
    job.ffmpeg = null;
    return data;
}

// ---- job lifecycle ------------------------------------------------------------------

async function jobDir(jobId, create) {
    const root = await navigator.storage.getDirectory();
    return root.getDirectoryHandle(`${DIR_PREFIX}${jobId}`, { create });
}

async function cleanupJob(jobId) {
    const job = jobs.get(jobId);
    jobs.delete(jobId);
    if (job?.blobUrl) URL.revokeObjectURL(job.blobUrl);
    try {
        const root = await navigator.storage.getDirectory();
        await root.removeEntry(`${DIR_PREFIX}${jobId}`, { recursive: true });
    } catch { /* already gone */ }
}

async function runJob(params) {
    const { jobId } = params;
    const job = { abort: new AbortController(), ffmpeg: null, blobUrl: null };
    jobs.set(jobId, job);
    try {
        report(jobId, { status: 'extracting' });
        const result = await extractLinks(job, params);
        const streams = result.streams || [];
        if (!streams.length || !streams.every(s => hostAllowed(s.url, MEDIA_HOSTS))) {
            throw new JobError('failed', 'The server returned unexpected download links.');
        }
        const plan = outputPlan(result);
        const estimated = streams.reduce((sum, s) => sum + (s.filesize || 0), 0);
        if (plan.ffmpeg && estimated > MAX_MERGE_BYTES) {
            throw new JobError('too_large', 'This video is too large to process in the browser.');
        }
        report(jobId, { status: 'downloading', percent: 0, title: result.title });

        const dir = await jobDir(jobId, true);
        const totals = streams.map(s => s.filesize || 0);
        let downloaded = 0;
        let lastReport = 0;
        const inputFiles = [];
        for (const [index, stream] of streams.entries()) {
            const handle = await dir.getFileHandle(`in${index}.${stream.ext || 'bin'}`, { create: true });
            await downloadStream(job, stream, handle, (bytes, total) => {
                downloaded += bytes;
                totals[index] = total;
                const sum = totals.reduce((a, b) => a + b, 0);
                const percent = sum ? Math.min(99, Math.round((downloaded / sum) * 100)) : 0;
                if (Date.now() - lastReport > 400) {
                    lastReport = Date.now();
                    report(jobId, { status: 'downloading', percent });
                }
            });
            inputFiles.push(await handle.getFile());
        }

        const filename = safeFilename(result.title, plan.ext);
        let output;
        if (plan.ffmpeg) {
            report(jobId, { status: 'processing', percent: 0 });
            const outName = `out.${plan.ext}`;
            const data = await runFfmpeg(job, result, inputFiles, outName, (percent) => {
                report(jobId, { status: 'processing', percent });
            });
            const outHandle = await dir.getFileHandle(outName, { create: true });
            const writable = await outHandle.createWritable();
            await writable.write(data);
            await writable.close();
            output = await outHandle.getFile();
        } else {
            output = inputFiles[0];
        }
        if (job.abort.signal.aborted) throw new DOMException('Cancelled', 'AbortError');

        job.blobUrl = URL.createObjectURL(output);
        report(jobId, { status: 'ready', percent: 100, blobUrl: job.blobUrl, filename });
    } catch (error) {
        job.ffmpeg?.terminate();
        if (job.abort.signal.aborted) {
            report(jobId, { status: 'cancelled', error: 'Download cancelled.' });
        } else {
            console.error('[RightMate] YouTube relay job failed', error);
            const code = error instanceof JobError ? error.code : 'failed';
            const message = error instanceof JobError ? error.message : 'The download failed.';
            report(jobId, { status: 'error', code, error: message, fallback: error instanceof JobError ? error.fallback : true });
        }
        await cleanupJob(jobId);
    }
}

function cancelJob(jobId) {
    const job = jobs.get(jobId);
    if (!job) return;
    job.abort.abort();
    job.ffmpeg?.terminate();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.target !== 'offscreen-yt') return false;
    if (message.action === 'YT_RELAY_START') {
        runJob(message);
    } else if (message.action === 'YT_RELAY_CANCEL') {
        cancelJob(message.jobId);
    } else if (message.action === 'YT_RELAY_CLEANUP') {
        cleanupJob(message.jobId);
    }
    sendResponse({ ok: true });
    return false;
});

// A fresh offscreen document has no running jobs, so any job folders are leftovers.
(async () => {
    try {
        const root = await navigator.storage.getDirectory();
        for await (const name of root.keys()) {
            if (name.startsWith(DIR_PREFIX)) await root.removeEntry(name, { recursive: true }).catch(() => {});
        }
    } catch { /* OPFS unavailable */ }
})();
