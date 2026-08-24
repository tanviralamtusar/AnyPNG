/**
 * Pro Image Tools — Offscreen Document Script
 * Performs image conversion (PNG / WebP / AVIF) using OffscreenCanvas.
 * 
 * Data is received as base64 strings (ArrayBuffer doesn't survive
 * chrome.runtime.sendMessage serialization).
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.target !== 'offscreen') {
        return false;
    }

    if (message.action === 'convertImage') {
        handleConversion(message.data, message.mimeType, message.targetType, message.quality)
            .then((encodedBase64) => {
                sendResponse({ data: encodedBase64 });
            })
            .catch((error) => {
                console.error('[Offscreen] Conversion error:', error);
                sendResponse({ error: error.message });
            });
        return true; // async response
    }

    if (message.action === 'remuxVideoAudio') {
        handleRemux(message.video, message.audio)
            .then((mp4Base64) => {
                sendResponse({ data: mp4Base64 });
            })
            .catch((error) => {
                console.error('[Offscreen] Remux error:', error);
                sendResponse({ error: error.message });
            });
        return true; // async response
    }

    return false;
});

/**
 * Convert any image base64 string to PNG, WebP or AVIF.
 *
 * PNG and WebP go through the canvas encoder. AVIF cannot: Blink's
 * ImageEncodingMimeType enum is {png, jpeg, webp}, so convertToBlob() silently
 * hands back a PNG for image/avif in every Chrome version. AVIF is therefore
 * encoded with the bundled libavif build instead (see encodeAvif below).
 *
 * @param {string} base64Data - The source image data as base64.
 * @param {string} mimeType - The MIME type of the source image.
 * @param {string} [targetType='image/png'] - The MIME type to encode to.
 * @param {number} [quality] - Encoder quality 0-1, for the lossy targets only.
 * @returns {Promise<string>} Encoded image data as a base64 string.
 */
async function handleConversion(base64Data, mimeType, targetType = 'image/png', quality) {
    // Decode base64 to Uint8Array
    const raw = atob(base64Data);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
    }

    // Create a Blob from the binary data
    const blob = new Blob([uint8Array], { type: mimeType || 'image/png' });

    // Decode into an ImageBitmap
    const imageBitmap = await createImageBitmap(blob);

    // Create an OffscreenCanvas matching the image dimensions
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d');

    try {
        // Draw the image onto the canvas
        ctx.drawImage(imageBitmap, 0, 0);

        if (targetType === 'image/avif') {
            // getImageData gives straight (non-premultiplied) RGBA, which is what
            // libavif wants — the alpha channel rides along and is encoded into the
            // AVIF alpha aux item, so transparency survives.
            const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
            return arrayBufferToBase64(await encodeAvif(data, width, height, quality));
        }

        // WebP keeps the alpha channel too, so nothing is flattened here either.
        const encodeOptions = { type: targetType };
        if (typeof quality === 'number') encodeOptions.quality = quality;
        const outputBlob = await canvas.convertToBlob(encodeOptions);

        // convertToBlob falls back to PNG for anything it can't encode; check what
        // actually came back rather than returning a PNG wearing a .webp extension.
        if (outputBlob.type !== targetType) {
            throw new Error(`This browser can't encode ${formatName(targetType)}. Use PNG instead.`);
        }

        return arrayBufferToBase64(await outputBlob.arrayBuffer());
    } finally {
        imageBitmap.close();
    }
}

function formatName(mimeType) {
    return { 'image/png': 'PNG', 'image/webp': 'WebP', 'image/avif': 'AVIF' }[mimeType] || mimeType;
}

// ==========================================================
// 🖼️ AVIF ENCODING — bundled libavif (WASM)
// ==========================================================

// Mirrors @jsquash/avif's defaults. This is the full option set the wasm binding
// expects; it does no merging of its own, so every field must be present.
const AVIF_DEFAULT_OPTIONS = {
    quality: 50,
    qualityAlpha: -1,   // -1 = match the colour quality
    denoiseLevel: 0,
    tileColsLog2: 0,
    tileRowsLog2: 0,
    speed: 6,           // 0 slowest/smallest … 10 fastest/largest
    subsample: 1,       // 1 = YUV420, 3 = YUV444
    chromaDeltaQ: false,
    sharpness: 0,
    tune: 0,            // auto
    enableSharpYUV: false,
    bitDepth: 8,
};

// The wasm is ~3.3 MB, so it is imported lazily on the first AVIF conversion and
// then reused for the lifetime of this offscreen document.
let avifModulePromise = null;

function loadAvifModule() {
    if (!avifModulePromise) {
        avifModulePromise = import(chrome.runtime.getURL('scripts/avif_enc.js'))
            .then(({ default: moduleFactory }) => moduleFactory({
                noInitialRun: true,
                // The glue resolves the .wasm against import.meta.url, which already
                // works here; naming the packed resource explicitly keeps it correct
                // regardless of where the script is loaded from.
                locateFile: (path) => chrome.runtime.getURL(`scripts/${path}`),
            }))
            .catch((error) => {
                avifModulePromise = null; // let a later attempt retry a transient failure
                throw error;
            });
    }
    return avifModulePromise;
}

/**
 * Encode straight RGBA pixels to AVIF.
 * @param {Uint8ClampedArray} rgba - Non-premultiplied RGBA, 4 bytes per pixel.
 * @param {number} width
 * @param {number} height
 * @param {number} [quality] - 0-1; 1 selects lossless.
 * @returns {Promise<ArrayBuffer>} The AVIF file bytes.
 */
async function encodeAvif(rgba, width, height, quality) {
    const module = await loadAvifModule();

    const options = { ...AVIF_DEFAULT_OPTIONS };
    if (typeof quality === 'number') {
        // libavif quality is 0-100. At 1.0 use true lossless, which additionally
        // requires 4:4:4 and lossless alpha.
        if (quality >= 1) {
            options.quality = 100;
            options.qualityAlpha = -1;
            options.subsample = 3;
        } else {
            options.quality = Math.round(quality * 100);
        }
    }

    // getImageData hands back a Uint8ClampedArray; the binding wants a plain
    // Uint8Array view over the same bytes (no copy).
    const pixels = new Uint8Array(rgba.buffer, rgba.byteOffset, rgba.byteLength);

    const output = module.encode(pixels, width, height, options);
    if (!output) throw new Error('AVIF encoding failed.');

    // `output` is a view onto the wasm heap, and that heap can be detached by a
    // later growth, so copy the bytes out now. (This is also why we don't return
    // output.buffer, which would hand back the entire wasm memory.)
    return new Uint8Array(output).buffer;
}

/**
 * Video/audio remux — combines a separately-fetched video-only and audio-only
 * fragmented MP4 stream (the common YouTube adaptive-format case) into one playable
 * MP4, entirely client-side. Uses mp4box.js to demux each input stream down to its raw
 * samples + codec config, then mp4-muxer to write those raw samples into a new file —
 * no transcoding, no server involved.
 */

function base64ToArrayBuffer(base64) {
    const raw = atob(base64);
    const buf = new ArrayBuffer(raw.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
    return buf;
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

// Strips a parsed mp4box.js box down to its raw payload (drops the 8-byte size+type
// header) — this is the exact byte layout a WebCodecs-style decoder "description"
// (e.g. an AVCDecoderConfigurationRecord) expects.
function getBoxPayload(box) {
    const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
    box.write(stream);
    return new Uint8Array(stream.buffer, 8);
}

function demuxTrack(arrayBuffer) {
    return new Promise((resolve, reject) => {
        const mp4boxfile = MP4Box.createFile();
        const samples = [];
        let trackInfo = null;
        let settled = false;

        mp4boxfile.onError = (e) => {
            if (settled) return;
            settled = true;
            reject(new Error('mp4box parse error: ' + e));
        };

        mp4boxfile.onReady = (info) => {
            trackInfo = info.tracks && info.tracks[0];
            if (!trackInfo) {
                settled = true;
                reject(new Error('No track found in captured stream'));
                return;
            }
            mp4boxfile.setExtractionOptions(trackInfo.id, null, { nbSamples: Infinity });
            mp4boxfile.start();
        };

        mp4boxfile.onSamples = (id, user, sampleArray) => {
            if (settled) return;
            samples.push(...sampleArray);
            settled = true;
            mp4boxfile.stop();

            try {
                const trak = mp4boxfile.moov.traks.find((t) => t.tkhd.track_id === trackInfo.id);
                const stsdEntry = trak.mdia.minf.stbl.stsd.entries[0];
                const isVideo = trackInfo.type === 'video' || !!trackInfo.video;
                const configBox = isVideo ? (stsdEntry.avcC || stsdEntry.hvcC) : stsdEntry.esds;

                resolve({
                    trackInfo,
                    samples,
                    timescale: trackInfo.timescale,
                    description: configBox ? getBoxPayload(configBox) : null,
                    width: stsdEntry.width || (trackInfo.video && trackInfo.video.width) || trackInfo.track_width,
                    height: stsdEntry.height || (trackInfo.video && trackInfo.video.height) || trackInfo.track_height,
                    channelCount: stsdEntry.channel_count || (trackInfo.audio && trackInfo.audio.channel_count),
                    sampleRate: stsdEntry.samplerate || (trackInfo.audio && trackInfo.audio.sample_rate),
                });
            } catch (e) {
                reject(e);
            }
        };

        arrayBuffer.fileStart = 0;
        mp4boxfile.appendBuffer(arrayBuffer);
        mp4boxfile.flush();
    });
}

function videoCodecFamily(codecString) {
    if (!codecString) return null;
    if (codecString.startsWith('avc1') || codecString.startsWith('avc3')) return 'avc';
    if (codecString.startsWith('hvc1') || codecString.startsWith('hev1')) return 'hevc';
    return null; // vp9/av1 (WebM-typical) are out of scope for v1 client-side remux
}

async function handleRemux(videoBase64, audioBase64) {
    const videoData = await demuxTrack(base64ToArrayBuffer(videoBase64));
    const audioData = audioBase64 ? await demuxTrack(base64ToArrayBuffer(audioBase64)) : null;

    const codec = videoCodecFamily(videoData.trackInfo.codec);
    if (!codec) {
        throw new Error(`Unsupported video codec for client-side remux: ${videoData.trackInfo.codec}`);
    }

    const muxerOptions = {
        target: new Mp4Muxer.ArrayBufferTarget(),
        video: { codec, width: videoData.width, height: videoData.height },
        fastStart: 'in-memory',
    };
    if (audioData) {
        muxerOptions.audio = { codec: 'aac', numberOfChannels: audioData.channelCount, sampleRate: audioData.sampleRate };
    }

    const muxer = new Mp4Muxer.Muxer(muxerOptions);

    const videoMeta = videoData.description ? { decoderConfig: { description: videoData.description } } : undefined;
    for (const s of videoData.samples) {
        muxer.addVideoChunkRaw(
            s.data,
            s.is_sync ? 'key' : 'delta',
            Math.round((s.cts / videoData.timescale) * 1e6),
            Math.round((s.duration / videoData.timescale) * 1e6),
            videoMeta,
            Math.round(((s.cts - s.dts) / videoData.timescale) * 1e6)
        );
    }

    if (audioData) {
        const audioMeta = audioData.description ? { decoderConfig: { description: audioData.description } } : undefined;
        for (const s of audioData.samples) {
            muxer.addAudioChunkRaw(
                s.data,
                'key',
                Math.round((s.cts / audioData.timescale) * 1e6),
                Math.round((s.duration / audioData.timescale) * 1e6),
                audioMeta
            );
        }
    }

    muxer.finalize();
    return arrayBufferToBase64(muxer.target.buffer);
}
