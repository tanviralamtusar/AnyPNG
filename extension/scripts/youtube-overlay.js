// Floating download button + panel for YouTube video pages.
//
// YouTube is a single-page app (history.pushState, no reloads), so this script runs
// once per tab and adds/removes its UI as the user navigates. Everything lives in a
// shadow root because YouTube's global CSS reshapes plain injected markup.
//
// Downloads run on the server (yt-dlp). This script only collects the choice, sends
// YT_START_DOWNLOAD to the service worker, and renders the YT_JOB_STATUS updates.
(() => {
    'use strict';

    const HOST_ID = 'rightmate-yt-overlay';
    // Below the loading overlay in content.js (2147483647) so it never covers it.
    const Z_INDEX = '2147483000';
    const KINDS = [
        { id: 'mp4', label: 'MP4' },
        { id: 'webm', label: 'WebM' },
        { id: 'mp3', label: 'MP3' },
    ];
    const HEIGHTS = [2160, 1440, 1080, 720, 480, 360];
    const ACTIVE = ['extracting', 'queued', 'downloading', 'processing', 'ready'];

    let host = null;
    let shadow = null;
    let panelOpen = false;
    let selectedKind = 'mp4';
    let selectedHeight = 1080;
    let pageInfo = { isSignedIn: true, isLicensed: true, licenseMessage: null, maxHeight: null, isLive: false };
    const jobs = new Map();

    function isVideoPage() {
        const { pathname, search } = location;
        if (pathname === '/watch') return new URLSearchParams(search).has('v');
        if (pathname.startsWith('/shorts/')) return pathname.length > 8;
        return false;
    }

    function currentVideoId() {
        if (location.pathname === '/watch') return new URLSearchParams(location.search).get('v');
        if (location.pathname.startsWith('/shorts/')) return location.pathname.split('/')[2] || null;
        return null;
    }

    function currentTitle() {
        return document.title.replace(/^\(\d+\)\s*/, '').replace(/\s*-\s*YouTube$/, '').trim() || 'YouTube video';
    }

    const STYLES = `
        :host { all: initial; }
        .wrap {
            position: fixed; right: 24px; bottom: 96px; z-index: ${Z_INDEX};
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
        }
        .fab {
            position: relative; width: 52px; height: 52px; border-radius: 50%; border: none;
            background: #10b981; color: #fff; cursor: pointer; padding: 0;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,.35); transition: transform .15s ease, background .15s ease;
        }
        .fab:hover { background: #0ea472; transform: scale(1.06); }
        .fab:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
        .fab svg { width: 24px; height: 24px; display: block; }
        .fab .dot {
            position: absolute; top: 2px; right: 2px; width: 12px; height: 12px; border-radius: 50%;
            background: #f59e0b; border: 2px solid #111827; display: none;
        }
        .fab.busy .dot { display: block; }

        .panel {
            width: 280px; background: #1f2937; color: #f3f4f6;
            border: 1px solid rgba(255,255,255,.12); border-radius: 14px; padding: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,.45); display: flex; flex-direction: column; gap: 10px;
            font-size: 13px;
        }
        .panel[hidden] { display: none; }
        .title { color: #9ca3af; font-size: 11px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; }
        .tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; background: #111827; padding: 3px; border-radius: 9px; }
        .tab {
            appearance: none; border: none; background: transparent; color: #d1d5db; font: inherit; font-weight: 600;
            padding: 7px 0; border-radius: 7px; cursor: pointer;
        }
        .tab[aria-pressed="true"] { background: #10b981; color: #fff; }
        .qualities { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .qualities[hidden] { display: none; }
        .q {
            appearance: none; border: 1px solid rgba(255,255,255,.14); background: transparent; color: #f3f4f6;
            font: inherit; padding: 7px 0; border-radius: 8px; cursor: pointer;
        }
        .q:hover:not(:disabled) { border-color: #10b981; }
        .q[aria-pressed="true"] { border-color: #10b981; background: rgba(16,185,129,.18); color: #fff; }
        .q:disabled { opacity: .35; cursor: not-allowed; }
        .note { color: #9ca3af; font-size: 12px; line-height: 1.4; }
        .note[hidden] { display: none; }
        .primary {
            appearance: none; border: none; background: #10b981; color: #fff; font: inherit; font-weight: 700;
            padding: 10px; border-radius: 9px; cursor: pointer;
        }
        .primary:hover:not(:disabled) { background: #0ea472; }
        .primary:disabled { opacity: .5; cursor: not-allowed; }
        .primary[hidden] { display: none; }
        button:focus-visible { outline: 2px solid #10b981; outline-offset: 1px; }
        .error { color: #fca5a5; font-size: 12px; }
        .error:empty { display: none; }

        .jobs { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 10px; }
        .jobs:empty { display: none; }
        .job { display: flex; flex-direction: column; gap: 5px; }
        .job-top { display: flex; align-items: center; gap: 8px; }
        .job-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .job-meta { color: #9ca3af; font-size: 11px; white-space: nowrap; }
        .job-x {
            appearance: none; border: none; background: transparent; color: #9ca3af; cursor: pointer;
            font-size: 16px; line-height: 1; padding: 2px 4px; border-radius: 5px;
        }
        .job-x:hover { color: #fff; background: rgba(255,255,255,.1); }
        .bar { height: 4px; background: #374151; border-radius: 2px; overflow: hidden; }
        .bar > div { height: 100%; background: #10b981; width: 0; transition: width .3s ease; }
        .job.failed .bar > div { background: #ef4444; }
        .job.processing .bar > div { animation: pulse 1.2s ease-in-out infinite; }
        .job-status { color: #9ca3af; font-size: 11px; }
        .job.failed .job-status { color: #fca5a5; }
        .job-retry {
            align-self: flex-start; appearance: none; border: 1px solid rgba(255,255,255,.2); background: transparent;
            color: #f3f4f6; font: inherit; font-size: 12px; padding: 5px 10px; border-radius: 7px; cursor: pointer;
        }
        .job-retry:hover { border-color: #10b981; }
        @keyframes pulse { 50% { opacity: .45; } }
        @media (prefers-reduced-motion: reduce) {
            .fab, .bar > div { transition: none; }
            .job.processing .bar > div { animation: none; }
        }
    `;

    const DOWNLOAD_ICON = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3v12"></path><path d="m7 12 5 5 5-5"></path><path d="M4 20h16"></path>
        </svg><span class="dot"></span>`;

    function $(selector) {
        return shadow.querySelector(selector);
    }

    function build() {
        // isConnected, not just a null check: if YouTube's DOM churn removes the node,
        // a stale reference would otherwise keep the button from ever coming back.
        if (host && host.isConnected) return;
        host = document.createElement('div');
        host.id = HOST_ID;
        shadow = host.attachShadow({ mode: 'open' });
        panelOpen = false;

        shadow.innerHTML = `
            <style>${STYLES}</style>
            <div class="wrap">
                <div class="panel" hidden role="dialog" aria-label="Download video">
                    <div class="title">Download video</div>
                    <div class="tabs" role="group" aria-label="Format"></div>
                    <div class="qualities" role="group" aria-label="Quality"></div>
                    <div class="note" data-note hidden></div>
                    <div class="error" aria-live="polite"></div>
                    <button type="button" class="primary" data-download>Download</button>
                    <button type="button" class="primary" data-signin hidden>Sign in to download</button>
                    <button type="button" class="primary" data-license hidden>Activate your license</button>
                    <div class="jobs" aria-live="polite"></div>
                </div>
                <button type="button" class="fab" aria-haspopup="dialog" aria-expanded="false"
                        title="Download this video with RightMate"
                        aria-label="Download this video with RightMate">${DOWNLOAD_ICON}</button>
            </div>`;

        const tabs = $('.tabs');
        KINDS.forEach(({ id, label }) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'tab';
            tab.dataset.kind = id;
            tab.textContent = label;
            tab.addEventListener('click', () => { selectedKind = id; renderChoices(); });
            tabs.appendChild(tab);
        });

        const qualities = $('.qualities');
        HEIGHTS.forEach((height) => {
            const q = document.createElement('button');
            q.type = 'button';
            q.className = 'q';
            q.dataset.height = String(height);
            q.textContent = height >= 2160 ? '4K' : height === 1440 ? '2K' : `${height}p`;
            q.addEventListener('click', () => { selectedHeight = height; renderChoices(); });
            qualities.appendChild(q);
        });

        $('.fab').addEventListener('click', () => setPanel(!panelOpen));
        $('[data-download]').addEventListener('click', startDownload);
        $('[data-signin]').addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'OPEN_LOGIN' }).catch(() => {});
        });
        $('[data-license]').addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'OPEN_LICENSE' }).catch(() => {});
        });

        document.documentElement.appendChild(host);
        renderChoices();
        renderJobs();
    }

    function destroy() {
        if (!host) return;
        host.remove();
        host = null;
        shadow = null;
        panelOpen = false;
    }

    function setPanel(open) {
        if (!shadow) return;
        panelOpen = open;
        $('.panel').hidden = !open;
        $('.fab').setAttribute('aria-expanded', String(open));
        if (open) {
            $('.error').textContent = '';
            refreshPageInfo();
        }
    }

    async function refreshPageInfo() {
        const videoId = currentVideoId();
        try {
            const info = await chrome.runtime.sendMessage({ action: 'YT_GET_QUALITIES', videoId });
            if (info && videoId === currentVideoId()) pageInfo = info;
        } catch {
            // Worker asleep or extension reloading; keep every option available.
        }
        renderChoices();
    }

    function renderChoices() {
        if (!shadow) return;
        const { maxHeight, isLive, isSignedIn, isLicensed, licenseMessage } = pageInfo;

        shadow.querySelectorAll('.tab').forEach((tab) => {
            tab.setAttribute('aria-pressed', String(tab.dataset.kind === selectedKind));
        });

        const isAudio = selectedKind === 'mp3';
        $('.qualities').hidden = isAudio;
        // Heights above what the player offers are disabled. Anything at or below stays
        // enabled: the server picks the closest available quality under the choice.
        if (maxHeight && selectedHeight > maxHeight) {
            selectedHeight = HEIGHTS.find(h => h <= maxHeight) || HEIGHTS[HEIGHTS.length - 1];
        }
        shadow.querySelectorAll('.q').forEach((q) => {
            const height = Number(q.dataset.height);
            q.disabled = !!maxHeight && height > maxHeight;
            q.setAttribute('aria-pressed', String(height === selectedHeight));
        });

        const note = $('[data-note]');
        if (isLive) {
            note.textContent = "Live streams can't be downloaded.";
        } else if (!isSignedIn) {
            note.textContent = 'Sign in to your RightMate account to download videos.';
        } else if (!isLicensed) {
            note.textContent = licenseMessage || 'Activate your license to download videos.';
        } else {
            note.textContent = '';
        }
        note.hidden = !note.textContent;

        $('[data-download]').hidden = !isSignedIn || !isLicensed;
        $('[data-download]').disabled = isLive;
        $('[data-signin]').hidden = isSignedIn;
        $('[data-license]').hidden = !isSignedIn || isLicensed;
    }

    async function startDownload() {
        const button = $('[data-download]');
        button.disabled = true;
        $('.error').textContent = '';
        const quality = selectedKind === 'mp3' ? 'MP3' : `${selectedKind.toUpperCase()} ${selectedHeight}p`;
        try {
            // location.href, not the worker's tab.url: right after SPA navigation the
            // tab's recorded URL can still be the previous video.
            const result = await chrome.runtime.sendMessage({
                action: 'YT_START_DOWNLOAD',
                url: location.href,
                kind: selectedKind,
                height: selectedKind === 'mp3' ? null : selectedHeight,
                label: `${currentTitle()} · ${quality}`,
            });
            if (result?.error === 'signin') {
                pageInfo = { ...pageInfo, isSignedIn: false };
            } else if (result?.error === 'license') {
                pageInfo = { ...pageInfo, isLicensed: false, licenseMessage: result.message };
            } else if (!result?.ok) {
                $('.error').textContent = result?.error || 'Could not start the download.';
            }
        } catch {
            $('.error').textContent = 'The extension was updated. Reload this page and try again.';
        }
        button.disabled = false;
        renderChoices();
    }

    function statusText(job) {
        const percent = Math.round(job.percent || 0);
        const onServer = job.mode === 'server';
        switch (job.status) {
            case 'extracting': return 'Getting download links…';
            case 'queued': return 'Waiting for server…';
            case 'downloading': return onServer ? `Preparing on server… ${percent}%` : `Downloading… ${percent}%`;
            case 'processing': {
                const step = job.kind === 'mp3' ? 'Converting to MP3…' : 'Merging video and audio…';
                return !onServer && job.kind === 'mp3' && percent ? `${step} ${percent}%` : step;
            }
            case 'ready': return 'Saving…';
            case 'saved': return 'Saved to your Downloads folder.';
            case 'cancelled': return 'Cancelled.';
            default: return job.error || 'Download failed.';
        }
    }

    async function retryOnServer(jobId, job) {
        jobs.delete(jobId);
        chrome.runtime.sendMessage({ action: 'YT_DISMISS_JOB', jobId }).catch(() => {});
        renderJobs();
        try {
            const result = await chrome.runtime.sendMessage({
                action: 'YT_START_DOWNLOAD',
                mode: 'server',
                url: job.url,
                kind: job.kind,
                height: job.height,
                label: job.label,
            });
            if (!result?.ok && shadow) {
                if (result?.error === 'signin') $('.error').textContent = 'Please sign in again.';
                else if (result?.error === 'license') $('.error').textContent = result.message;
                else $('.error').textContent = result?.error || 'Could not start the server download.';
            }
        } catch {
            if (shadow) $('.error').textContent = 'The extension was updated. Reload this page and try again.';
        }
    }

    function renderJobs() {
        if (!shadow) return;
        const list = $('.jobs');
        list.replaceChildren();
        for (const [jobId, job] of jobs) {
            const active = ACTIVE.includes(job.status);
            const failed = job.status === 'error' || job.status === 'cancelled';
            const row = document.createElement('div');
            row.className = `job${failed ? ' failed' : ''}${job.status === 'processing' ? ' processing' : ''}`;

            const top = document.createElement('div');
            top.className = 'job-top';
            const label = document.createElement('span');
            label.className = 'job-label';
            label.textContent = job.label;
            label.title = job.label;
            const close = document.createElement('button');
            close.type = 'button';
            close.className = 'job-x';
            close.textContent = '×';
            close.title = active ? 'Cancel download' : 'Dismiss';
            close.setAttribute('aria-label', close.title);
            close.addEventListener('click', () => {
                if (active) {
                    chrome.runtime.sendMessage({ action: 'YT_CANCEL', jobId }).catch(() => {});
                } else {
                    jobs.delete(jobId);
                    chrome.runtime.sendMessage({ action: 'YT_DISMISS_JOB', jobId }).catch(() => {});
                    renderJobs();
                }
            });
            top.append(label, close);

            const bar = document.createElement('div');
            bar.className = 'bar';
            const fill = document.createElement('div');
            const done = ['processing', 'ready', 'saved'].includes(job.status) || failed;
            fill.style.width = `${done ? 100 : Math.max(2, job.percent || 0)}%`;
            bar.appendChild(fill);

            const status = document.createElement('div');
            status.className = 'job-status';
            status.textContent = statusText(job);

            row.append(top, bar, status);
            if (job.status === 'error' && job.fallback && job.mode !== 'server') {
                const retry = document.createElement('button');
                retry.type = 'button';
                retry.className = 'job-retry';
                retry.textContent = 'Try server download';
                retry.addEventListener('click', () => retryOnServer(jobId, job));
                row.appendChild(retry);
            }
            list.appendChild(row);
        }
        $('.fab').classList.toggle('busy', [...jobs.values()].some(job => ACTIVE.includes(job.status)));
    }

    function sync() {
        // Fullscreen puts the player above everything; a floating button is just in the way.
        const shouldShow = isVideoPage() && !document.fullscreenElement;
        if (shouldShow) build();
        else destroy();
    }

    let lastVideoId = currentVideoId();
    function onNavigate() {
        const videoId = currentVideoId();
        if (videoId !== lastVideoId) {
            lastVideoId = videoId;
            pageInfo = { ...pageInfo, maxHeight: null, isLive: false };
            if (panelOpen) refreshPageInfo();
            else renderChoices();
        }
        sync();
    }

    function jobFromMessage({ url, label, kind, height, mode, status, percent, error, fallback }) {
        return { url, label, kind, height, mode, status, percent, error, fallback };
    }

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action !== 'YT_JOB_STATUS') return;
        jobs.set(message.jobId, jobFromMessage(message));
        renderJobs();
    });

    document.addEventListener('click', (e) => {
        // Clicks inside the shadow root are retargeted to the host.
        if (panelOpen && e.target !== host) setPanel(false);
    }, true);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panelOpen) setPanel(false);
    });

    document.addEventListener('fullscreenchange', sync);
    // YouTube's navigation event, plus a poll since the event name has changed over the
    // years; the poll also re-attaches the button if anything detached it.
    window.addEventListener('yt-navigate-finish', onNavigate);
    setInterval(onNavigate, 1000);

    // Downloads started before a full page reload are still tracked by the worker.
    chrome.runtime.sendMessage({ action: 'YT_LIST_JOBS' }).then((result) => {
        for (const job of result?.jobs || []) jobs.set(job.jobId, jobFromMessage(job));
        renderJobs();
    }).catch(() => {});

    sync();
})();
