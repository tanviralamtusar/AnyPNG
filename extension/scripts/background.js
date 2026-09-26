// license.js owns the device id, the entitlement cache and the Supabase session
// refresh, and is also loaded directly by the extension pages.
importScripts('license.js');

// Local (offscreen-canvas) image conversion targets. `download_<key>` is the
// context-menu id for each; `lossy` decides whether the saved quality setting applies.
const IMAGE_FORMATS = {
    png:  { name: "PNG",  label: "Convert to PNG",  mimeType: "image/png",  ext: "png",  lossy: false },
    webp: { name: "WebP", label: "Convert to WebP", mimeType: "image/webp", ext: "webp", lossy: true },
    avif: { name: "AVIF", label: "Convert to AVIF", mimeType: "image/avif", ext: "avif", lossy: true },
};

// Quality passed to the canvas encoder for lossy targets. 1 makes Chrome pick
// lossless WebP; AVIF stays lossy at every value.
const DEFAULT_CONVERSION_QUALITY = 0.9;

// Per-tab Google Drive queues. Each file is handed to Chrome independently so
// Drive never bundles a folder's videos into a ZIP archive.
const driveDownloadJobs = new Map();
const driveDownloadOwners = new Map();

function driveSafeName(name, index) {
    const fallback = `drive-media-${index + 1}`;
    const cleaned = String(name || fallback).replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/^\.+/, '').trim();
    return cleaned || fallback;
}

function driveSafeFolder(name) {
    // Chrome download paths are relative to the browser's Downloads directory.
    // A single sanitized directory name prevents absolute paths and traversal.
    const cleaned = String(name || 'Drive media').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/^\.+/, '').trim();
    return cleaned || 'Drive media';
}

function notifyDriveQueue(tabId, payload) {
    chrome.tabs.sendMessage(tabId, { action: 'DRIVE_QUEUE_STATUS', ...payload }).catch(() => {});
}

function driveInitialDownloadUrl(file) {
    const query = new URLSearchParams({ id: file.id, export: 'download', confirm: 't', _drive_dl: crypto.randomUUID() });
    if (file.resourceKey) query.set('resourcekey', file.resourceKey);
    return `https://drive.usercontent.google.com/download?${query}`;
}

function decodeDriveHtmlAttribute(value) {
    return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}

function driveConfirmedUrlFromWarning(html) {
    const form = html.match(/<form\b[^>]*\baction="([^"]+)"[^>]*>/i);
    if (!form) return null;
    const query = new URLSearchParams();
    for (const match of html.matchAll(/<input\b[^>]*>/gi)) {
        const name = match[0].match(/\bname="([^"]+)"/i);
        const value = match[0].match(/\bvalue="([^"]*)"/i);
        if (name && value) query.set(decodeDriveHtmlAttribute(name[1]), decodeDriveHtmlAttribute(value[1]));
    }
    if (!query.get('id') || !query.get('uuid') || !query.get('at')) return null;
    return `${decodeDriveHtmlAttribute(form[1])}?${query}`;
}

async function resolveDriveDownloadUrl(file) {
    const initialUrl = driveInitialDownloadUrl(file);
    const response = await fetch(initialUrl, { cache: 'no-store', credentials: 'include' });
    if (!(response.headers.get('content-type') || '').toLowerCase().includes('text/html')) {
        await response.body?.cancel();
        return initialUrl;
    }
    const confirmedUrl = driveConfirmedUrlFromWarning(await response.text());
    if (!confirmedUrl) throw new Error('Drive returned HTML without a Download Anyway link.');
    return confirmedUrl;
}

function driveConcurrency(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? Math.min(5, Math.max(1, parsed)) : 3;
}

function finishDriveQueue(tabId, job) {
    if (job.cursor < job.files.length || job.pending > 0 || job.active.size > 0) return;
    driveDownloadJobs.delete(tabId);
    notifyDriveQueue(tabId, { state: 'finished', done: job.done, failed: job.failed, total: job.files.length });
}

function completeDriveDownload(tabId, downloadId, successful) {
    const job = driveDownloadJobs.get(tabId);
    if (!job || !job.active.has(downloadId)) return;
    job.active.delete(downloadId);
    driveDownloadOwners.delete(downloadId);
    if (successful) job.done += 1;
    else job.failed += 1;
    if (!job.stopped) fillDriveDownloads(tabId);
}

async function launchDriveDownload(tabId, job, file, index) {
    try {
        // Re-checked per file, not only when the queue starts: a long queue can
        // outlive the entitlement, and this is a second gate besides the start check.
        if (!await rmTokenUsable(await rmGetLicenseState())) {
            if (job.stopped) return;   // another slot already ended the queue
            job.stopped = true;
            driveDownloadJobs.delete(tabId);
            notifyDriveQueue(tabId, { state: 'finished', done: job.done, failed: job.files.length - job.done, total: job.files.length });
            refreshLicenseMenus();
            return;
        }
        const url = await resolveDriveDownloadUrl(file);
        if (job.stopped || driveDownloadJobs.get(tabId) !== job) return;
        const downloadId = await chrome.downloads.download({
            url,
            filename: `${job.folder}/${driveSafeName(file.name, index)}`,
            conflictAction: 'uniquify',
            saveAs: false
        });
        if (job.stopped || driveDownloadJobs.get(tabId) !== job) return;
        job.active.set(downloadId, file);
        driveDownloadOwners.set(downloadId, tabId);
        const [download] = await chrome.downloads.search({ id: downloadId });
        if (download?.state === 'complete' || download?.state === 'interrupted') {
            completeDriveDownload(tabId, downloadId, download.state === 'complete');
        }
    } catch (error) {
        job.failed += 1;
        console.warn('Could not start Drive download', file.name, error);
    } finally {
        job.pending -= 1;
        if (!job.stopped && driveDownloadJobs.get(tabId) === job) fillDriveDownloads(tabId);
    }
}

function fillDriveDownloads(tabId) {
    const job = driveDownloadJobs.get(tabId);
    if (!job || job.stopped) return;
    while (job.cursor < job.files.length && job.active.size + job.pending < job.concurrency) {
        const index = job.cursor;
        const file = job.files[job.cursor++];
        job.pending += 1;
        notifyDriveQueue(tabId, { state: 'downloading', name: file.name, done: job.done, failed: job.failed, started: job.cursor, active: job.active.size + job.pending, total: job.files.length });
        void launchDriveDownload(tabId, job, file, index);
    }
    finishDriveQueue(tabId, job);
}

chrome.downloads.onChanged.addListener(delta => {
    const state = delta.state?.current;
    if (state !== 'complete' && state !== 'interrupted') return;
    const tabId = driveDownloadOwners.get(delta.id);
    if (tabId !== undefined) completeDriveDownload(tabId, delta.id, state === 'complete');
});

// "download_png" -> "png"; returns null for anything that isn't a local conversion item.
function imageFormatFromMenuId(menuItemId) {
    if (typeof menuItemId !== "string" || !menuItemId.startsWith("download_")) return null;
    const key = menuItemId.slice("download_".length);
    return IMAGE_FORMATS[key] ? key : null;
}

async function getConversionQuality() {
    const { conversionQuality } = await chrome.storage.sync.get("conversionQuality");
    const quality = Number(conversionQuality);
    return Number.isFinite(quality) && quality > 0 && quality <= 1 ? quality : DEFAULT_CONVERSION_QUALITY;
}

// Grey the tools out rather than letting a click fail: an unlicensed install
// should say what is missing before the user picks an action.
const LICENSED_MENU_IDS = ["upscale_png", "remove_bg_png", ...Object.keys(IMAGE_FORMATS).map(key => `download_${key}`)];

// Create the Right-Click Menus. Run on service-worker startup as well so a
// reload immediately removes menu entries from older extension versions.
function createContextMenus() {
    // removeAll first: on an extension update the previously registered items are
    // still around, and re-creating an existing id fails with "duplicate id".
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({ id: "pro_image_tools", title: "RightMate", contexts: ["page", "image"] });
        Object.entries(IMAGE_FORMATS).forEach(([key, { label }]) => {
            chrome.contextMenus.create({ id: `download_${key}`, title: label, parentId: "pro_image_tools", contexts: ["image"] });
        });
        chrome.contextMenus.create({ id: "upscale_png", title: "✨ Upscale & Download", parentId: "pro_image_tools", contexts: ["image"] });
        chrome.contextMenus.create({ id: "remove_bg_png", title: "✂️ Remove Background", parentId: "pro_image_tools", contexts: ["image"] });
        chrome.contextMenus.create({ id: "open_license", title: "🔑 Activate your license", parentId: "pro_image_tools", contexts: ["page", "image"], visible: false });
        refreshLicenseMenus();
    });
}
chrome.runtime.onInstalled.addListener(createContextMenus);
createContextMenus();


async function refreshLicenseMenus() {
    const licensed = await rmIsLicensed().catch(() => false);
    for (const id of LICENSED_MENU_IDS) {
        chrome.contextMenus.update(id, { enabled: licensed }, () => void chrome.runtime.lastError);
    }
    chrome.contextMenus.update("open_license", { visible: !licensed }, () => void chrome.runtime.lastError);
    chrome.contextMenus.update("pro_image_tools", { title: licensed ? "RightMate" : "RightMate (license required)" },
        () => void chrome.runtime.lastError);
    return licensed;
}

/**
 * Gate for every user-triggered action. Opens the license page and tells the
 * caller to stop when this device is not licensed.
 */
async function ensureLicensed({ notify = true } = {}) {
    const state = await rmGetLicenseState();
    await refreshLicenseMenus();
    if (state.licensed) return true;
    if (notify) {
        chrome.notifications.create({
            type: 'basic', iconUrl: ICON_URL, title: 'RightMate',
            message: rmLicenseMessage(state.reason)
        });
    }
    if (state.reason !== 'offline') rmOpenLicensePage();
    return false;
}

// Bare relative iconUrl strings ("icons/icon48.png") resolve unreliably for
// chrome.notifications.create() from an MV3 service worker (intermittent
// "Unable to download all specified images" errors) — use an explicit
// chrome-extension:// URL instead.
const ICON_URL = chrome.runtime.getURL('icons/icon48.png');

// Temporary hand-off storage for the local inpainting editor. The blob stays in
// the extension origin and is never sent to the backend.
function storeInpaintBlob(blob) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('anypng-local-editor', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('jobs');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const id = crypto.randomUUID();
            const tx = request.result.transaction('jobs', 'readwrite');
            tx.objectStore('jobs').put({ blob, createdAt: Date.now() }, id);
            tx.oncomplete = () => resolve(id);
            tx.onerror = () => reject(tx.error);
        };
    });
}

async function authorizeLocalInpaint() {
    const session = await getValidSession();
    const accessToken = getAccessToken(session);
    if (!accessToken) throw new Error('Please sign in to use inpainting credits.');
    const response = await fetch(`${API_CONFIG.url}/inpaint/authorize`, {
        method: 'POST',
        headers: await requireAuthHeaders(),
    });
    let data = null;
    try { data = await response.json(); } catch (_) { /* handled below */ }
    if (!response.ok || !data?.authorized) throw new Error(data?.detail || 'No inpainting credits remaining.');
    return data;
}

async function resolveContextImageUrl(info, tab) {
    if (info.srcUrl) return info.srcUrl;
    if (!tab?.id) return null;
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [info.x, info.y],
        func: (x, y) => {
            const hasPoint = Number.isFinite(x) && Number.isFinite(y);
            const pointX = hasPoint ? x : window.innerWidth / 2;
            const pointY = hasPoint ? y : window.innerHeight / 2;
            const element = document.elementFromPoint(pointX, pointY);
            const urlFromBackground = (node) => {
                for (let current = node; current && current !== document.body; current = current.parentElement) {
                    const background = getComputedStyle(current).backgroundImage;
                    const match = background && background.match(/url\(["']?(.*?)["']?\)/);
                    if (match?.[1]) return match[1];
                }
                return null;
            };
            const direct = element?.closest?.('img') || (element?.tagName === 'IMG' ? element : null);
            if (direct?.currentSrc || direct?.src) return direct.currentSrc || direct.src;
            const backgroundUrl = urlFromBackground(element);
            if (backgroundUrl) return backgroundUrl;

            // Gallery controls and overlays often sit above the actual <img>.
            // Pick the visible image whose box contains the click, or the nearest
            // visible image when the click landed on a sibling overlay.
            const candidates = [...document.images].filter(image => {
                const box = image.getBoundingClientRect();
                return box.width > 32 && box.height > 32 && getComputedStyle(image).visibility !== 'hidden';
            });
            candidates.sort((a, b) => {
                const distance = (image) => {
                    const box = image.getBoundingClientRect();
                    const dx = Math.max(box.left - pointX, 0, pointX - box.right);
                    const dy = Math.max(box.top - pointY, 0, pointY - box.bottom);
                    const areaPenalty = hasPoint ? 0 : -box.width * box.height;
                    return dx * dx + dy * dy + areaPenalty;
                };
                return distance(a) - distance(b);
            });
            const best = candidates[0];
            if (best?.currentSrc || best?.src) return best.currentSrc || best.src;

            // Some galleries use a div background instead of an <img>.
            const backgrounds = [...document.querySelectorAll('*')].map(node => {
                const box = node.getBoundingClientRect();
                const background = getComputedStyle(node).backgroundImage;
                const match = background && background.match(/url\(["']?(.*?)["']?\)/);
                return { box, url: match?.[1] || null };
            }).filter(item => item.url && item.box.width > 32 && item.box.height > 32);
            backgrounds.sort((a, b) => b.box.width * b.box.height - a.box.width * a.box.height);
            return backgrounds[0]?.url || null;
        },
    });
    return results?.[0]?.result || null;
}

// 🔒 API CONFIGURATION
async function resolveContextImageUrlViaContentScript(info, tab) {
    const direct = info.srcUrl ? [info.srcUrl] : [];
    if (!tab?.id) return direct;
    try {
        const result = await chrome.tabs.sendMessage(tab.id, { action: "GET_IMAGE_AT_POINT", x: info.x, y: info.y });
        return [...new Set([...(result?.srcs || []), ...direct])];
    } catch (error) {
        console.warn('[AnyPNG] Could not query the page content script for an image', error);
        return direct;
    }
}

// The old static basicToken is gone: it shipped in this file, so anyone who
// unpacked the extension had it. Protected endpoints now take the user's
// Supabase token plus the signed entitlement from license.js.
const API_CONFIG = { url: RIGHTMATE_API_URL };

// Session handling lives in license.js so the pages and the worker share one
// refresh path.
function getValidSession() {
    return rmGetSession();
}

let cachedImageBlob = null;
let currentTabId = null;

const DEFAULT_PROMPT = "recreate this image in high quality.";

// Helper: Blob to Base64
const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});

// A wasm AVIF encode of a large image runs for tens of seconds, and an MV3
// service worker is torn down after 30s without activity — which would strand
// the caller's promise and leave the loading overlay up forever. Calling a
// trivial extension API on an interval resets that idle timer while we wait.
function withServiceWorkerKeepalive(promise) {
    const timer = setInterval(() => chrome.runtime.getPlatformInfo(), 20000);
    return promise.finally(() => clearInterval(timer));
}

// Only one offscreen document may exist, so concurrent callers share one creation.
let offscreenCreating = null;
async function setupOffscreenDocument(path) {
    const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [chrome.runtime.getURL(path)] });
    if (existingContexts.length > 0) return;
    offscreenCreating ??= chrome.offscreen.createDocument({
        url: path,
        reasons: ['WORKERS', 'BLOBS'],
        justification: 'Image conversion, and downloading/merging YouTube videos on-device'
    }).finally(() => { offscreenCreating = null; });
    await offscreenCreating;
}

function toggleLoadingScreen(tabId, show, text = "") {
    chrome.tabs.sendMessage(tabId, { action: show ? "SHOW_LOADING" : "HIDE_LOADING", text: text })
        .catch(() => { if (show) chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'RightMate', message: text }); });
}

// Listen for clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {

    if (info.menuItemId === "open_license") {
        rmOpenLicensePage();
        return;
    }
    if (!await ensureLicensed()) return;

    // ==========================================
    // ✨ AI TOOLS: UPSCALE & BACKGROUND REMOVAL
    // ==========================================
    if (info.menuItemId === "upscale_png" || info.menuItemId === "remove_bg_png") {
        chrome.storage.sync.get(['upscaleFactor'], async (settings) => {
            const scale = settings.upscaleFactor || '2';

            try {
                toggleLoadingScreen(tab.id, true, info.menuItemId === "remove_bg_png"
                    ? "Loading local background remover..."
                    : "Running AI on server...");

                const response = await fetch(info.srcUrl);
                const imageBlob = await response.blob();
                let finalBlob;

                if (info.menuItemId === "remove_bg_png") {
                    // Background removal runs on-device first. The server remains a
                    // fallback for older browsers or devices without enough GPU/RAM.
                    await setupOffscreenDocument('pages/offscreen.html');
                    const dataUrl = await blobToDataUrl(imageBlob);
                    try {
                        const localResult = await withServiceWorkerKeepalive(chrome.runtime.sendMessage({
                            target: 'offscreen',
                            action: 'removeBackground',
                            data: dataUrl.split(',')[1],
                            mimeType: imageBlob.type,
                            ...await offscreenLicense()
                        }));
                        if (localResult.error) throw new Error(localResult.error);
                        finalBlob = await (await fetch(`data:image/png;base64,${localResult.data}`)).blob();
                    } catch (localError) {
                        console.warn('[AnyPNG] Local remover failed; using server fallback:', localError);
                        toggleLoadingScreen(tab.id, true, "Local model unavailable; using server fallback...");
                        const formData = new FormData();
                        formData.append('image', imageBlob);
                        const apiRes = await fetch(`${API_CONFIG.url}/remove-background`, {
                            method: 'POST',
                            headers: await requireAuthHeaders(),
                            body: formData
                        });
                        if (!apiRes.ok) throw new Error(await apiErrorMessage(apiRes));
                        finalBlob = await apiRes.blob();
                    }
                } else {
                    const formData = new FormData();
                    formData.append('image', imageBlob);
                    formData.append('scale', scale);
                    const apiRes = await fetch(`${API_CONFIG.url}/upscale`, {
                        method: 'POST',
                        headers: await requireAuthHeaders(),
                        body: formData
                    });
                    if (!apiRes.ok) throw new Error(await apiErrorMessage(apiRes));
                    finalBlob = await apiRes.blob();
                }

                const downloadUrl = await blobToDataUrl(finalBlob);

                let prefix = info.menuItemId === "upscale_png" ? `RightMate_Upscaled_${scale}x` : `RightMate_Transparent`;
                chrome.downloads.download({ url: downloadUrl, filename: `${prefix}_${Date.now()}.png` });

            } catch (error) {
                chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Failed', message: error.message });
            } finally {
                toggleLoadingScreen(tab.id, false);
            }
        });
    }

    // ==========================================
    // 🔄 LOCAL TOOL: PNG / WEBP / AVIF CONVERSION
    // ==========================================
    else if (imageFormatFromMenuId(info.menuItemId)) {
        const format = IMAGE_FORMATS[imageFormatFromMenuId(info.menuItemId)];
        try {
            toggleLoadingScreen(tab.id, true, `Converting image to ${format.name} locally...`);
            const response = await fetch(info.srcUrl);
            const blob = await response.blob();
            const fullDataUrl = await blobToDataUrl(blob);
            const base64Data = fullDataUrl.split(',')[1];

            await setupOffscreenDocument('pages/offscreen.html');
            const result = await withServiceWorkerKeepalive(chrome.runtime.sendMessage({
                target: 'offscreen',
                action: 'convertImage',
                data: base64Data,
                mimeType: blob.type,
                targetType: format.mimeType,
                quality: format.lossy ? await getConversionQuality() : undefined,
                ...await offscreenLicense()
            }));

            if (result.error) throw new Error(result.error);
            chrome.downloads.download({ url: `data:${format.mimeType};base64,${result.data}`, filename: `RightMate_Converted_${Date.now()}.${format.ext}` });

        } catch (error) {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Conversion Failed', message: error.message });
        } finally {
            toggleLoadingScreen(tab.id, false);
        }
    }
});

// The offscreen document re-verifies the entitlement itself before running a
// local tool, so bypassing ensureLicensed() here is not enough on its own. It
// has no chrome.storage access, hence the token and device id travel along.
async function offscreenLicense() {
    return { license: (await rmGetLicenseState()).token || '', deviceId: await rmGetDeviceId() };
}

// Authorization + X-License for a protected backend call. Throws rather than
// sending an unauthenticated request that the server would reject anyway.
async function requireAuthHeaders() {
    const headers = await rmAuthHeaders();
    if (!headers) {
        refreshLicenseMenus();
        throw new Error(rmLicenseMessage((await rmGetLicenseState()).reason));
    }
    return headers;
}

// A licensing rejection carries a structured detail; anything else may not.
async function apiErrorMessage(response) {
    let detail = null;
    try { detail = (await response.json())?.detail; } catch { /* non-JSON body */ }
    if (detail?.error === 'license') {
        rmGetLicenseState({ force: true }).then(refreshLicenseMenus);
        return detail.message;
    }
    if (typeof detail === 'string') return detail;
    return `Server error (${response.status}).`;
}

// Extract the Supabase access token from a session object (handles nested formats)
function getAccessToken(session) {
    if (!session) return null;
    if (session.access_token) return session.access_token;
    if (session.session && session.session.access_token) return session.session.access_token;
    return null;
}

// Helper Function specifically for the Watermark API
async function callWatermarkBackend(prompt, session, method = "standard", downloadResult = false) {
    // The deployed /remove-watermark endpoint authenticates the user via their
    // Supabase session JWT (to identify the account and deduct credits) — not the
    // static basic token. Use the access token from the already-validated session.
    const accessToken = getAccessToken(session);
    if (!accessToken) {
        await chrome.storage.local.set({ watermarkProcessing: false });
        chrome.runtime.sendMessage({ action: "SHOW_ERROR", error: "Session expired. Please open RightMate and log in again." }).catch(() => {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Login Required', message: 'Please open RightMate and log in again.' });
        });
        return;
    }

    let blobToProcess = cachedImageBlob;

    // If service worker restarted, try to load from storage
    if (!blobToProcess) {
        const { lastOriginalImage } = await chrome.storage.local.get('lastOriginalImage');
        if (lastOriginalImage) {
            const res = await fetch(lastOriginalImage);
            blobToProcess = await res.blob();
        } else {
            chrome.runtime.sendMessage({ action: "SHOW_ERROR", error: "Original image lost. Please right-click and try again." }).catch(() => { });
            return;
        }
    }

    // The AI model is a user setting; only relevant for the "gemini" method.
    // The backend validates it against an allowlist and falls back if unknown.
    const { aiModel } = await chrome.storage.sync.get('aiModel');

    const formData = new FormData();
    formData.append('image', blobToProcess);
    formData.append('prompt', prompt);
    formData.append('method', method);
    if (aiModel) formData.append('model', aiModel);

    try {
        const apiRes = await fetch(`${API_CONFIG.url}/remove-watermark`, {
            method: 'POST',
            headers: await requireAuthHeaders(),
            body: formData
        });

        if (!apiRes.ok) throw new Error(await apiErrorMessage(apiRes));

        const finalBlob = await apiRes.blob();
        const base64Data = await blobToDataUrl(finalBlob);

        // Save to storage for the popup to read
        await chrome.storage.local.set({ lastWatermarkResult: base64Data, watermarkProcessing: false });

        if (downloadResult) {
            chrome.downloads.download({
                url: base64Data,
                filename: `RightMate_Watermark_Removed_${Date.now()}.png`,
                saveAs: false,
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Download failed', message: chrome.runtime.lastError.message });
                } else {
                    chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Watermark removed', message: 'The cleaned image was downloaded.' });
                }
            });
            return;
        }

        // Notify popup if it's open
        chrome.runtime.sendMessage({ action: "UPDATE_PREVIEW", image: base64Data }).catch(() => {
            // If popup is closed, just show a notification
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Watermark Removed!', message: 'Click the RightMate icon to view the result.' });
        });

    } catch (error) {
        let userMessage = error.message || "Unknown error";
        const lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes("does not support image") ||
            lowerMsg.includes("cannot read image") ||
            lowerMsg.includes("image input") ||
            lowerMsg.includes("unsupported image format")) {
            userMessage = "This image format is not supported. Please try a different image (PNG, JPG, or WebP recommended).";
        } else if (lowerMsg.includes("model") || lowerMsg.includes("not_found") || lowerMsg.includes("404")) {
            userMessage = "The server AI model is unavailable. Please redeploy the backend with the current Gemini image model.";
        } else if (lowerMsg.includes("failed to fetch") || lowerMsg.includes("network")) {
            userMessage = "Network error. Please check your connection and try again.";
        }

        console.error("Watermark API Error:", error);
        await chrome.storage.local.set({ watermarkProcessing: false });
        
        chrome.runtime.sendMessage({ action: "SHOW_ERROR", error: userMessage }).catch(() => {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Error', message: userMessage });
        });
    }
}

// ==========================================
// 🎬 YOUTUBE DOWNLOADS (server-side yt-dlp jobs)
// ==========================================
const YT_POLL_INTERVAL_MS = 1500;
const YT_QUALITY_LEVELS = {
    highres: 4320, hd2880: 2880, hd2160: 2160, hd1440: 1440, hd1080: 1080,
    hd720: 720, large: 480, medium: 360, small: 240, tiny: 144
};
const YT_ACTIVE_STATUSES = ['extracting', 'queued', 'downloading', 'processing', 'ready'];
// jobId -> { tabId, url, label, kind, height, mode: 'relay'|'server', status, percent, error, fallback }
const ytJobs = new Map();

function ytJobPayload(jobId, job) {
    const { tabId, url, label, kind, height, mode, status, percent, error, fallback } = job;
    return { jobId, tabId, url, label, kind, height, mode, status, percent, error, fallback };
}

function notifyYoutubeJob(jobId) {
    const job = ytJobs.get(jobId);
    if (!job) return;
    chrome.tabs.sendMessage(job.tabId, { action: 'YT_JOB_STATUS', ...ytJobPayload(jobId, job) }).catch(() => {});
}

function ytJobsForTab(tabId) {
    return [...ytJobs.entries()].filter(([, job]) => job.tabId === tabId).map(([jobId, job]) => ytJobPayload(jobId, job));
}

// Runs in the page's MAIN world: content scripts can't see YouTube's player API.
function readYoutubePlayerQualities() {
    try {
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        const data = player?.getVideoData?.() || {};
        return {
            levels: player?.getAvailableQualityLevels?.() || [],
            videoId: data.video_id || null,
            isLive: !!data.isLive
        };
    } catch {
        return { levels: [], videoId: null, isLive: false };
    }
}

async function getYoutubeQualities(sender, expectedVideoId) {
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    const license = await rmGetLicenseState();
    const result = {
        isSignedIn: !!supabaseSession?.access_token,
        isLicensed: !!license.licensed,
        licenseMessage: license.licensed ? null : rmLicenseMessage(license.reason),
        maxHeight: null,
        isLive: false
    };
    try {
        const [injection] = await chrome.scripting.executeScript({
            target: { tabId: sender.tab.id, frameIds: [sender.frameId ?? 0] },
            world: 'MAIN',
            func: readYoutubePlayerQualities
        });
        const info = injection?.result;
        // Right after SPA navigation the player can still describe the previous video;
        // in that case report nothing and let every quality stay selectable.
        if (info && (!expectedVideoId || info.videoId === expectedVideoId)) {
            const heights = info.levels.map(level => YT_QUALITY_LEVELS[level]).filter(Boolean);
            result.maxHeight = heights.length ? Math.max(...heights) : null;
            result.isLive = info.isLive;
        }
    } catch (error) {
        console.warn('[RightMate] Could not read YouTube player qualities', error);
    }
    return result;
}

async function ytApi(path, accessToken, options = {}) {
    const response = await fetch(`${API_CONFIG.url}${path}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(options.headers || {})
        }
    });
    let data = null;
    try { data = await response.json(); } catch { /* empty body */ }
    return { ok: response.ok, status: response.status, data };
}

function ytErrorMessage(result, fallback) {
    const detail = result?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (detail?.message) return detail.message;
    return fallback;
}

async function pollYoutubeJob(jobId, accessToken) {
    let token = accessToken;
    while (ytJobs.has(jobId)) {
        await new Promise(resolve => setTimeout(resolve, YT_POLL_INTERVAL_MS));
        const job = ytJobs.get(jobId);
        if (!job || job.status === 'cancelled') return;

        let result;
        try {
            result = await ytApi(`/youtube/jobs/${jobId}`, token);
            if (result.status === 401) {
                // Access tokens expire after an hour; refresh once and retry.
                const session = await getValidSession();
                if (!session?.access_token) throw new Error('Your session expired. Please sign in again.');
                token = session.access_token;
                result = await ytApi(`/youtube/jobs/${jobId}`, token);
            }
        } catch (error) {
            Object.assign(job, { status: 'error', error: error.message || 'Lost connection to the server.' });
            notifyYoutubeJob(jobId);
            return;
        }

        if (!result.ok) {
            Object.assign(job, { status: 'error', error: ytErrorMessage(result, 'Download failed.') });
            notifyYoutubeJob(jobId);
            return;
        }

        const status = result.data;
        Object.assign(job, { status: status.status, percent: status.percent || 0, error: status.error || null });

        if (status.status === 'ready') {
            try {
                await chrome.downloads.download({
                    url: `${API_CONFIG.url}${status.download_url}`,
                    filename: driveSafeName(status.filename, 0),
                    conflictAction: 'uniquify'
                });
                job.status = 'saved';
            } catch (error) {
                Object.assign(job, { status: 'error', error: 'Chrome could not start the download.' });
            }
            notifyYoutubeJob(jobId);
            return;
        }
        notifyYoutubeJob(jobId);
        if (status.status === 'error' || status.status === 'cancelled') return;
    }
}

function ytJobRequest(message, sender) {
    const kind = ['mp4', 'webm', 'mp3'].includes(message.kind) ? message.kind : 'mp4';
    return {
        tabId: sender.tab?.id,
        url: String(message.url || ''),
        label: String(message.label || 'YouTube video').slice(0, 120),
        kind,
        height: kind === 'mp3' ? null : (Number(message.height) || null)
    };
}

async function startYoutubeDownload(message, sender) {
    const request = ytJobRequest(message, sender);
    if (request.tabId === undefined) return { ok: false, error: 'No tab.' };
    const session = await getValidSession();
    if (!session?.access_token) return { ok: false, error: 'signin' };
    const license = await rmGetLicenseState();
    if (!license.licensed) {
        refreshLicenseMenus();
        return { ok: false, error: 'license', message: rmLicenseMessage(license.reason) };
    }
    return message.mode === 'server'
        ? startServerYoutubeDownload(request, session, license.token)
        : startRelayYoutubeDownload(request, session, license.token);
}

// Default path: yt-dlp's requests are relayed through the offscreen document so they come
// from the user's IP; the offscreen document then downloads and merges the streams itself.
async function startRelayYoutubeDownload(request, session, entitlement) {
    const jobId = crypto.randomUUID();
    const job = { ...request, mode: 'relay', status: 'extracting', percent: 0, error: null, fallback: false };
    ytJobs.set(jobId, job);
    notifyYoutubeJob(jobId);
    job.keepalive = setInterval(() => chrome.runtime.getPlatformInfo(), 20000);
    try {
        await setupOffscreenDocument('pages/offscreen.html');
        await chrome.runtime.sendMessage({
            target: 'offscreen-yt',
            action: 'YT_RELAY_START',
            jobId,
            wsUrl: `${API_CONFIG.url.replace(/^http/, 'ws')}/youtube/extract`,
            token: session.access_token,
            license: entitlement,
            url: request.url,
            kind: request.kind,
            height: request.height
        });
    } catch (error) {
        console.error('[RightMate] Could not start the in-browser YouTube download', error);
        finishRelayJob(jobId, { status: 'error', error: 'Could not start the download.', fallback: true });
    }
    return { ok: true, jobId };
}

function finishRelayJob(jobId, update) {
    const job = ytJobs.get(jobId);
    if (!job) return;
    clearInterval(job.keepalive);
    delete job.keepalive;
    Object.assign(job, update);
    notifyYoutubeJob(jobId);
    if (job.downloadId === undefined) {
        chrome.runtime.sendMessage({ target: 'offscreen-yt', action: 'YT_RELAY_CLEANUP', jobId }).catch(() => {});
    }
}

async function handleRelayProgress(message) {
    const { jobId, status } = message;
    const job = ytJobs.get(jobId);
    if (!job || job.mode !== 'relay' || ['cancelled', 'saved'].includes(job.status)) return;

    if (status === 'ready') {
        Object.assign(job, { status: 'ready', percent: 100 });
        notifyYoutubeJob(jobId);
        try {
            job.downloadId = await chrome.downloads.download({
                url: message.blobUrl,
                filename: driveSafeName(message.filename, 0),
                conflictAction: 'uniquify'
            });
        } catch (error) {
            delete job.downloadId;
            finishRelayJob(jobId, { status: 'error', error: 'Chrome could not save the file.', fallback: false });
        }
        return;
    }
    if (status === 'error' || status === 'cancelled') {
        finishRelayJob(jobId, { status, error: message.error || null, fallback: !!message.fallback });
        return;
    }
    Object.assign(job, { status, percent: message.percent || 0 });
    notifyYoutubeJob(jobId);
}

chrome.downloads.onChanged.addListener((delta) => {
    if (!delta.state || !['complete', 'interrupted'].includes(delta.state.current)) return;
    for (const [jobId, job] of ytJobs) {
        if (job.downloadId !== delta.id) continue;
        delete job.downloadId;
        finishRelayJob(jobId, delta.state.current === 'complete'
            ? { status: 'saved', percent: 100 }
            : { status: 'error', error: 'Saving the file was interrupted.', fallback: false });
    }
});

// Fallback path: the server downloads the video itself (needs a cookies file or proxy on
// the server if YouTube bot-checks its IP).
async function startServerYoutubeDownload(request, session, entitlement) {
    const { kind, height } = request;
    let result;
    try {
        result = await ytApi('/youtube/jobs', session.access_token, {
            method: 'POST',
            headers: { 'X-License': entitlement },
            body: JSON.stringify({ url: request.url, kind, height })
        });
    } catch {
        return { ok: false, error: 'Could not reach the download server.' };
    }
    if (result.status === 401) return { ok: false, error: 'signin' };
    if (!result.ok) return { ok: false, error: ytErrorMessage(result, 'Could not start the download.') };

    const jobId = result.data.job_id;
    ytJobs.set(jobId, { ...request, mode: 'server', status: 'queued', percent: 0, error: null, fallback: false });
    notifyYoutubeJob(jobId);
    withServiceWorkerKeepalive(pollYoutubeJob(jobId, session.access_token))
        .catch(error => console.error('[RightMate] YouTube job polling failed', error));
    return { ok: true, jobId };
}

async function cancelYoutubeDownload(jobId) {
    const job = ytJobs.get(jobId);
    if (!job) return { ok: false };
    if (job.mode === 'relay') {
        chrome.runtime.sendMessage({ target: 'offscreen-yt', action: 'YT_RELAY_CANCEL', jobId }).catch(() => {});
        finishRelayJob(jobId, { status: 'cancelled', error: 'Download cancelled.', fallback: false });
        return { ok: true };
    }
    Object.assign(job, { status: 'cancelled', error: 'Download cancelled.' });
    notifyYoutubeJob(jobId);
    const session = await getValidSession();
    if (session?.access_token) {
        ytApi(`/youtube/jobs/${jobId}`, session.access_token, { method: 'DELETE' }).catch(() => {});
    }
    return { ok: true };
}

chrome.tabs.onRemoved.addListener((tabId) => {
    for (const [jobId, job] of ytJobs) {
        if (job.tabId === tabId && !YT_ACTIVE_STATUSES.includes(job.status)) ytJobs.delete(jobId);
    }
});

// Requests the extension itself makes to YouTube carry "Origin: chrome-extension://…",
// which YouTube's player API rejects with 403. Present them as youtube.com instead.
// tabIds [-1] limits this to non-tab requests (the offscreen relay/downloader), so
// normal browsing on YouTube is untouched.
const YT_ORIGIN_RULE_ID = 7301;
chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [YT_ORIGIN_RULE_ID],
    addRules: [{
        id: YT_ORIGIN_RULE_ID,
        priority: 1,
        action: {
            type: 'modifyHeaders',
            requestHeaders: [
                { header: 'origin', operation: 'set', value: 'https://www.youtube.com' },
                { header: 'referer', operation: 'set', value: 'https://www.youtube.com/' }
            ]
        },
        condition: {
            tabIds: [chrome.tabs.TAB_ID_NONE],
            requestDomains: ['youtube.com', 'googlevideo.com', 'youtubei.googleapis.com'],
            resourceTypes: ['xmlhttprequest']
        }
    }]
}).catch(error => console.error('[RightMate] Could not install the YouTube header rule', error));

function startDriveQueue(tabId, message, files, sendResponse) {
    const folder = driveSafeFolder(message.folder);
    const concurrency = driveConcurrency(message.concurrency);
    driveDownloadJobs.set(tabId, {
        files,
        folder,
        cursor: 0,
        done: 0,
        failed: 0,
        pending: 0,
        active: new Map(),
        concurrency,
        stopped: false
    });
    fillDriveDownloads(tabId);
    sendResponse({ ok: true, total: files.length, folder, concurrency });
}

// Runtime message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'YT_GET_QUALITIES') {
        getYoutubeQualities(sender, message.videoId).then(sendResponse);
        return true;
    } else if (message.action === 'YT_START_DOWNLOAD') {
        startYoutubeDownload(message, sender).then(sendResponse);
        return true;
    } else if (message.action === 'YT_CANCEL') {
        cancelYoutubeDownload(message.jobId).then(sendResponse);
        return true;
    } else if (message.action === 'YT_RELAY_PROGRESS') {
        handleRelayProgress(message);
    } else if (message.action === 'YT_LIST_JOBS') {
        sendResponse({ jobs: ytJobsForTab(sender.tab?.id) });
    } else if (message.action === 'YT_DISMISS_JOB') {
        const job = ytJobs.get(message.jobId);
        if (job && job.tabId === sender.tab?.id && !YT_ACTIVE_STATUSES.includes(job.status)) {
            ytJobs.delete(message.jobId);
        }
        sendResponse({ ok: true });
    } else if (message.action === 'OPEN_LOGIN') {
        chrome.tabs.create({ url: chrome.runtime.getURL('pages/login.html') });
        sendResponse({ ok: true });
    } else if (message.action === 'OPEN_LICENSE') {
        rmOpenLicensePage();
        sendResponse({ ok: true });
    } else if (message.action === 'LICENSE_CHANGED') {
        // The license page just activated, deactivated or re-checked a key.
        refreshLicenseMenus().then(licensed => sendResponse({ ok: true, licensed }));
        return true;
    } else if (message.action === 'GET_LICENSE_STATE') {
        rmGetLicenseState({ force: !!message.force }).then(sendResponse);
        return true;
    } else if (message.action === 'START_DRIVE_VIDEO_QUEUE') {
        const tabId = sender.tab?.id;
        const files = Array.isArray(message.files) ? message.files.filter(file => file?.id) : [];
        if (tabId === undefined || !files.length) {
            sendResponse({ ok: false, error: 'No Drive media files were found.' });
            return;
        }
        rmIsLicensed().then(licensed => {
            if (!licensed) return sendResponse({ ok: false, error: 'license' });
            startDriveQueue(tabId, message, files, sendResponse);
        });
        return true;
    } else if (message.action === 'STOP_DRIVE_VIDEO_QUEUE') {
        const tabId = sender.tab?.id;
        const job = driveDownloadJobs.get(tabId);
        if (job) {
            job.stopped = true;
            for (const downloadId of job.active.keys()) driveDownloadOwners.delete(downloadId);
        }
        driveDownloadJobs.delete(tabId);
        sendResponse({ ok: true });
    }
});
