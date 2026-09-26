/**
 * Pro Image Tools — Offscreen Document Script
 * Performs image conversion (PNG / WebP / AVIF) using OffscreenCanvas.
 * 
 * Data is received as base64 strings (ArrayBuffer doesn't survive
 * chrome.runtime.sendMessage serialization).
 */

// Public half of the backend's LICENSE_SIGNING_KEY. Deliberately a separate copy
// from license.js, verified by separate code: patching the license check in the
// service worker must not be enough to unlock the tools that run here.
const RM_LICENSE_PUBLIC_KEY = 'HYqoBe8rhoaZU9QFXO4TconHY9FPX_fkIuiMVxn_ITw';

const fromBase64Url = (value) => {
    const base64 = String(value).replace(/-/g, '+').replace(/_/g, '/');
    return Uint8Array.from(atob(base64 + '='.repeat((4 - base64.length % 4) % 4)), c => c.charCodeAt(0));
};

let licenseKeyPromise = null;

async function requireEntitlement(token, deviceId) {
    const [encoded, signature] = String(token || '').split('.');
    let payload = null;
    try {
        licenseKeyPromise ??= crypto.subtle.importKey(
            'raw', fromBase64Url(RM_LICENSE_PUBLIC_KEY), { name: 'Ed25519' }, false, ['verify']);
        if (encoded && signature && await crypto.subtle.verify(
            { name: 'Ed25519' }, await licenseKeyPromise, fromBase64Url(signature), new TextEncoder().encode(encoded))) {
            payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded)));
        }
    } catch { /* treated as unlicensed below */ }

    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(deviceId || ''))));
    const deviceHash = Array.from(digest, b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
    if (payload?.scope !== 'license' || !(payload.exp * 1000 > Date.now()) || payload.dev !== deviceHash) {
        throw new Error('RightMate needs an active license.');
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.target !== 'offscreen') {
        return false;
    }

    if (message.action === 'convertImage') {
        requireEntitlement(message.license, message.deviceId)
            .then(() => handleConversion(message.data, message.mimeType, message.targetType, message.quality))
            .then((encodedBase64) => {
                sendResponse({ data: encodedBase64 });
            })
            .catch((error) => {
                console.error('[Offscreen] Conversion error:', error);
                sendResponse({ error: error.message });
            });
        return true; // async response
    }

    if (message.action === 'removeBackground') {
        requireEntitlement(message.license, message.deviceId)
            .then(() => handleBackgroundRemoval(message.data, message.mimeType))
            .then((result) => sendResponse(result))
            .catch((error) => {
                console.error('[Offscreen] Background removal error:', error);
                sendResponse({ error: error.message });
            });
        return true;
    }

    return false;
});

let backgroundRemoverPromise = null;

async function loadBackgroundRemover() {
    if (!backgroundRemoverPromise) {
        backgroundRemoverPromise = (async () => {
            const { env, pipeline } = await import(
                chrome.runtime.getURL('scripts/transformers/transformers.min.js')
            );

            // Model weights are fetched once from Hugging Face and then kept in the
            // browser cache. Inference remains inside this extension page.
            env.allowLocalModels = false;
            env.useBrowserCache = true;
            env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('scripts/transformers/');
            // Chrome currently ignores powerPreference on Windows and logs a
            // warning from requestAdapter(). Let the browser choose the adapter.
            if (env.backends.onnx.webgpu) {
                env.backends.onnx.webgpu.powerPreference = undefined;
            }
            // RMBG contains a few operators that ONNX Runtime may place on CPU;
            // this is expected provider fallback, not a failed inference.
            env.backends.onnx.logLevel = 'error';

            const useWebGPU = !!navigator.gpu;
            try {
                return {
                    device: useWebGPU ? 'webgpu' : 'wasm',
                    remover: await pipeline('background-removal', 'briaai/RMBG-1.4', {
                        device: useWebGPU ? 'webgpu' : 'wasm',
                        dtype: useWebGPU ? 'fp16' : 'q8'
                    })
                };
            } catch (error) {
                // Some GPUs expose WebGPU but do not support the model's FP16
                // kernels. Retry with the portable WASM backend.
                if (!useWebGPU) throw error;
                console.warn('[Offscreen] WebGPU unavailable, retrying with WASM:', error);
                return {
                    device: 'wasm',
                    remover: await pipeline('background-removal', 'briaai/RMBG-1.4', {
                        device: 'wasm',
                        dtype: 'q8'
                    })
                };
            }
        })().catch((error) => {
            backgroundRemoverPromise = null;
            throw error;
        });
    }
    return backgroundRemoverPromise;
}

async function handleBackgroundRemoval(base64Data, mimeType = 'image/png') {
    const raw = atob(base64Data);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    const input = new Blob([bytes], { type: mimeType });
    const { remover, device } = await loadBackgroundRemover();
    {
        const output = await remover(input);
        const result = Array.isArray(output) ? output[0] : output;
        const png = await result.toBlob('image/png');
        return {
            data: arrayBufferToBase64(await png.arrayBuffer()),
            device
        };
    }
}

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

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}
