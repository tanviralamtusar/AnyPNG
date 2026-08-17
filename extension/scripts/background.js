// Create the Right-Click Menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "pro_image_tools", title: "AnyPNG", contexts: ["image"] });
    chrome.contextMenus.create({ id: "download_png", title: "Convert to PNG (Local)", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "upscale_png", title: "✨ Upscale & Download", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "watermark_png", title: "💎 Remove Watermark (Pro)", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "remove_bg_png", title: "✂️ Remove Background", parentId: "pro_image_tools", contexts: ["image"] });

    // Generic direct-src video download — works for plain <video src> sites.
    // Hidden (via onShown below) on the platforms that get the quality submenu instead.
    chrome.contextMenus.create({ id: "download_video", title: "⬇️ Download Video (AnyPNG)", contexts: ["video"] });

    // Quality-picker submenu for the four platforms with dedicated client-side handling.
    chrome.contextMenus.create({
        id: "video_download_tools",
        title: "🎬 Download Video",
        contexts: ["page", "video"],
        documentUrlPatterns: VIDEO_PLATFORM_MATCH_PATTERNS,
    });
    VIDEO_QUALITY_OPTIONS.forEach(({ id, label }) => {
        chrome.contextMenus.create({
            id: `video_quality_${id}`,
            title: label,
            parentId: "video_download_tools",
            contexts: ["page", "video"],
            documentUrlPatterns: VIDEO_PLATFORM_MATCH_PATTERNS,
        });
    });
});

// Bare relative iconUrl strings ("icons/icon48.png") resolve unreliably for
// chrome.notifications.create() from an MV3 service worker (intermittent
// "Unable to download all specified images" errors) — use an explicit
// chrome-extension:// URL instead.
const ICON_URL = chrome.runtime.getURL('icons/icon48.png');

// 🔒 API CONFIGURATION
const API_CONFIG = {
    url: "https://anypng.botbhai.net",
    basicToken: "my_super_secret_hostinger_token_123!"
};

const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

async function getValidSession() {
    let { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession) return null;
    
    if (supabaseSession.refresh_token) {
        try {
            const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'apikey': SUPABASE_ANON_KEY,
                    'x-client-info': 'anypng-extension'
                },
                body: JSON.stringify({ refresh_token: supabaseSession.refresh_token })
            });
            
            if (res.ok) {
                const newSession = await res.json();
                supabaseSession = { ...supabaseSession, ...newSession };
                await chrome.storage.local.set({ supabaseSession: supabaseSession });
            } else {
                const errorData = await res.json();
                console.error('Session refresh failed:', errorData);
                await chrome.storage.local.remove('supabaseSession');
                return null;
            }
        } catch (e) {
            console.error('Session refresh failed:', e);
            await chrome.storage.local.remove('supabaseSession');
            return null;
        }
    }
    return supabaseSession;
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

async function setupOffscreenDocument(path) {
    const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [chrome.runtime.getURL(path)] });
    if (existingContexts.length > 0) return;
    await chrome.offscreen.createDocument({ url: path, reasons: ['WORKERS'], justification: 'Conversion' });
}

function toggleLoadingScreen(tabId, show, text = "") {
    chrome.tabs.sendMessage(tabId, { action: show ? "SHOW_LOADING" : "HIDE_LOADING", text: text })
        .catch(() => { if (show) chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'AnyPNG', message: text }); });
}

// ==========================================================
// 🎬 VIDEO DOWNLOAD — client-first capture → remux → backend-fallback cascade
// ==========================================================

const VIDEO_PLATFORMS = {
    youtube: { hosts: ["youtube.com", "youtu.be"], cdnPatterns: ["*://*.googlevideo.com/*"] },
    instagram: { hosts: ["instagram.com"], cdnPatterns: ["*://*.cdninstagram.com/*", "*://*.fbcdn.net/*"] },
    facebook: { hosts: ["facebook.com", "fb.watch"], cdnPatterns: ["*://*.fbcdn.net/*", "*://*.cdninstagram.com/*"] },
    tiktok: { hosts: ["tiktok.com"], cdnPatterns: ["*://*.tiktokcdn.com/*", "*://*.tiktokcdn-us.com/*", "*://*.tiktokv.com/*"] },
};

const VIDEO_PLATFORM_MATCH_PATTERNS = Object.values(VIDEO_PLATFORMS)
    .flatMap(p => p.hosts)
    .flatMap(h => [`*://${h}/*`, `*://*.${h}/*`]);

const VIDEO_CDN_PATTERNS = Object.values(VIDEO_PLATFORMS).flatMap(p => p.cdnPatterns);

const VIDEO_QUALITY_OPTIONS = [
    { id: "best", label: "Best Quality" },
    { id: "1080", label: "1080p" },
    { id: "720", label: "720p" },
    { id: "480", label: "480p" },
    { id: "audio", label: "Audio Only (MP3)" },
];

function matchesAnyHost(hostname, hosts) {
    hostname = (hostname || "").toLowerCase();
    return hosts.some(h => hostname === h || hostname.endsWith("." + h));
}

function detectVideoPlatform(url) {
    try {
        const hostname = new URL(url).hostname;
        for (const [name, cfg] of Object.entries(VIDEO_PLATFORMS)) {
            if (matchesAnyHost(hostname, cfg.hosts)) return name;
        }
    } catch (e) { /* not a valid URL */ }
    return null;
}

// tabId -> [{ url, type, timestamp }] — cleared on navigation, capped per tab.
const capturedStreams = new Map();
const MAX_CAPTURED_PER_TAB = 25;
const CAPTURE_FRESHNESS_MS = 20000;

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.tabId < 0) return;
        const list = capturedStreams.get(details.tabId) || [];
        list.push({ url: details.url, type: details.type, timestamp: Date.now() });
        if (list.length > MAX_CAPTURED_PER_TAB) list.shift();
        capturedStreams.set(details.tabId, list);
    },
    { urls: VIDEO_CDN_PATTERNS },
    []
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") capturedStreams.delete(tabId);
});
chrome.tabs.onRemoved.addListener((tabId) => capturedStreams.delete(tabId));

// Show the quality submenu only on the four supported platforms; hide the generic
// direct-src item there so right-clicking a video never shows two AnyPNG video entries.
if (chrome.contextMenus.onShown) {
    chrome.contextMenus.onShown.addListener((info, tab) => {
        const isSupportedPlatform = !!detectVideoPlatform(info.pageUrl || (tab && tab.url));
        chrome.contextMenus.update("download_video", { visible: !isSupportedPlatform });
        chrome.contextMenus.update("video_download_tools", { visible: isSupportedPlatform });
        chrome.contextMenus.refresh();
    });
}

function classifyCapturedStream(url) {
    try {
        const mime = new URL(url).searchParams.get("mime"); // YouTube googlevideo.com URLs
        if (mime) {
            if (mime.startsWith("video/")) return mime.includes("mp4") ? "video-mp4" : "video-other";
            if (mime.startsWith("audio/")) return mime.includes("mp4") || mime.includes("mp4a") ? "audio-mp4" : "audio-other";
        }
    } catch (e) { /* ignore */ }
    return "muxed"; // Instagram/Facebook/TikTok CDN links are typically combined audio+video
}

function guessVideoExt(url) {
    const clean = url.split(/[?#]/)[0];
    const ext = (clean.split('.').pop() || '').toLowerCase();
    return /^[a-z0-9]{2,5}$/.test(ext) ? ext : 'mp4';
}

function notifyVideoDownloadSource(sourceLabel) {
    const labels = {
        direct: "Downloaded directly ✓",
        captured: "Downloaded directly ✓",
        remuxed: "Downloaded & merged locally ✓",
        server: "Downloaded via server ✓",
    };
    chrome.runtime.sendMessage({ action: "VIDEO_DOWNLOAD_STATUS", label: labels[sourceLabel] || "Downloaded ✓" }).catch(() => { });
}

async function arrayBufferToBase64(buffer) {
    const dataUrl = await blobToDataUrl(new Blob([buffer]));
    return dataUrl.split(',')[1];
}

// Below this, a captured URL is almost certainly not real media — e.g. YouTube's
// SABR streaming protocol rejects a naive replayed GET with a ~30-byte protobuf
// error ("sabr.malformed_config") instead of 403ing, which would otherwise silently
// download as a tiny, unplayable "video" file.
const MIN_VALID_VIDEO_BYTES = 50 * 1024;

async function downloadDirectUrl(url, platform, sourceLabel) {
    await new Promise((resolve, reject) => {
        chrome.downloads.download({ url, filename: `AnyPNG_${platform}_${Date.now()}.${guessVideoExt(url)}` }, (id) => {
            if (chrome.runtime.lastError || id === undefined) reject(new Error(chrome.runtime.lastError?.message || "Download failed"));
            else resolve(id);
        });
    });
    notifyVideoDownloadSource(sourceLabel);
}

// Same as downloadDirectUrl, but fetches and sanity-checks the payload size first —
// used for captured (not directly-observed-in-DOM) URLs, which are the ones a
// platform's streaming protocol can reject with a small placeholder instead of a
// clean HTTP error.
async function downloadCapturedUrl(url, platform, sourceLabel) {
    const buf = await fetch(url).then(r => {
        if (!r.ok) throw new Error(`Captured stream request failed: ${r.status}`);
        return r.arrayBuffer();
    });
    if (buf.byteLength < MIN_VALID_VIDEO_BYTES) {
        throw new Error(`Captured stream is too small (${buf.byteLength} bytes) to be real video — likely a protocol placeholder, not media data.`);
    }
    const dataUrl = await blobToDataUrl(new Blob([buf]));
    chrome.downloads.download({ url: dataUrl, filename: `AnyPNG_${platform}_${Date.now()}.${guessVideoExt(url)}` });
    notifyVideoDownloadSource(sourceLabel);
}

async function downloadAndRemux(videoUrl, audioUrl, platform) {
    const [videoBuf, audioBuf] = await Promise.all([
        fetch(videoUrl).then(r => r.arrayBuffer()),
        fetch(audioUrl).then(r => r.arrayBuffer()),
    ]);

    if (videoBuf.byteLength < MIN_VALID_VIDEO_BYTES || audioBuf.byteLength < MIN_VALID_VIDEO_BYTES) {
        throw new Error(`Captured stream(s) too small (video ${videoBuf.byteLength}B, audio ${audioBuf.byteLength}B) — likely a protocol placeholder, not media data.`);
    }

    await setupOffscreenDocument('pages/offscreen.html');
    const result = await chrome.runtime.sendMessage({
        target: 'offscreen',
        action: 'remuxVideoAudio',
        video: await arrayBufferToBase64(videoBuf),
        audio: await arrayBufferToBase64(audioBuf),
    });

    if (result.error) throw new Error(result.error);

    chrome.downloads.download({ url: `data:video/mp4;base64,${result.data}`, filename: `AnyPNG_${platform}_${Date.now()}.mp4` });
    notifyVideoDownloadSource("remuxed");
}

async function downloadViaBackend(tab, quality, platform) {
    toggleLoadingScreen(tab.id, true, "Downloading via server...");

    const formData = new FormData();
    formData.append('url', tab.url);
    formData.append('quality', quality || 'best');

    const apiRes = await fetch(`${API_CONFIG.url}/download-video`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_CONFIG.basicToken}` },
        body: formData,
    });

    if (!apiRes.ok) {
        const errData = await apiRes.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${apiRes.statusText}`);
    }

    const blob = await apiRes.blob();
    const dataUrl = await blobToDataUrl(blob);
    const ext = quality === 'audio' ? 'mp3' : 'mp4';
    chrome.downloads.download({ url: dataUrl, filename: `AnyPNG_${platform}_${Date.now()}.${ext}` });
    notifyVideoDownloadSource("server");
}

// Step 1: real <video> src if not blob-based. Step 2: nudge playback, then check
// what the platform's own player already fetched (captured passively via webRequest).
// Step 3: fall back to the self-hosted yt-dlp backend. Each step degrades gracefully
// into the next on failure rather than surfacing an error immediately.
async function resolveVideoDownload(tab, quality, pageUrlOverride) {
    const pageUrl = pageUrlOverride || tab.url;
    const platform = detectVideoPlatform(pageUrl);
    if (!platform) {
        chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'AnyPNG', message: 'This page is not a supported video platform (YouTube, Instagram, Facebook, TikTok).' });
        return;
    }

    // If the caller supplied a different URL than the tab's own (e.g. a pasted link
    // in the popup), the content-script/capture steps refer to the wrong page — go
    // straight to the backend, which fetches the URL itself server-side.
    const canUseTabLocalSteps = pageUrl === tab.url;

    toggleLoadingScreen(tab.id, true, "Locating video...");

    try {
        if (!canUseTabLocalSteps) {
            await downloadViaBackend({ ...tab, url: pageUrl }, quality, platform);
            return;
        }

        try {
            const res = await chrome.tabs.sendMessage(tab.id, { action: "GET_VIDEO_SRC" });
            const directSrc = res && res.src;
            if (directSrc && !directSrc.startsWith("blob:") && !directSrc.startsWith("mediasource:")) {
                await downloadDirectUrl(directSrc, platform, "direct");
                return;
            }
        } catch (e) { /* content script unavailable — fall through */ }

        try {
            await chrome.tabs.sendMessage(tab.id, { action: "NUDGE_VIDEO_PLAYBACK" });
        } catch (e) { /* fall through regardless */ }

        const streams = capturedStreams.get(tab.id) || [];
        const recent = streams.filter(s => Date.now() - s.timestamp < CAPTURE_FRESHNESS_MS);
        const classified = recent.map(s => ({ ...s, kind: classifyCapturedStream(s.url) }));

        const muxed = classified.filter(s => s.kind === "muxed");
        const videoMp4 = classified.filter(s => s.kind === "video-mp4");
        const audioMp4 = classified.filter(s => s.kind === "audio-mp4");

        try {
            if (muxed.length > 0) {
                await downloadCapturedUrl(muxed[muxed.length - 1].url, platform, "captured");
                return;
            }
            if (videoMp4.length > 0 && audioMp4.length > 0) {
                await downloadAndRemux(videoMp4[videoMp4.length - 1].url, audioMp4[audioMp4.length - 1].url, platform);
                return;
            }
        } catch (e) {
            console.warn("[AnyPNG] Client-side video capture/remux failed, falling back to server:", e);
        }

        // Step 3: backend fallback
        await downloadViaBackend(tab, quality, platform);

    } catch (error) {
        chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Video Download Failed', message: error.message });
    } finally {
        toggleLoadingScreen(tab.id, false);
    }
}

// Listen for clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {

    // ==========================================
    // 💎 PRO TOOL: WATERMARK (Uses Supabase Token & In-Page Editor)
    // ==========================================
    if (info.menuItemId === "watermark_png") {
        const supabaseSession = await getValidSession();
        if (!supabaseSession) {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Login Required', message: 'Please click the AnyPNG icon in your toolbar to Login first!' });
            return;
        }

        currentTabId = tab.id;

        // Notify user that processing started
        chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'AnyPNG Processing', message: 'Removing watermark... Please wait.' });
        await chrome.storage.local.set({ watermarkProcessing: true });
        chrome.runtime.sendMessage({ action: "PROCESSING_WATERMARK" }).catch(() => { });

        // Try to open the popup automatically
        if (chrome.action && chrome.action.openPopup) {
            chrome.action.openPopup().catch(() => { });
        }

        try {
            const response = await fetch(info.srcUrl);
            cachedImageBlob = await response.blob();
            const base64Original = await blobToDataUrl(cachedImageBlob);
            await chrome.storage.local.set({ lastOriginalImage: base64Original });

            await callWatermarkBackend(DEFAULT_PROMPT, supabaseSession, "gemini");
        } catch (e) {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Error', message: "Failed to fetch image: " + e.message });
        }
    }

    // ==========================================
    // 🆓 FREE TOOLS: UPSCALE & BG REMOVE (Uses Basic Token & Standard Loading)
    // ==========================================
    else if (info.menuItemId === "upscale_png" || info.menuItemId === "remove_bg_png") {
        chrome.storage.sync.get(['upscaleFactor'], async (settings) => {
            const scale = settings.upscaleFactor || '2';

            try {
                toggleLoadingScreen(tab.id, true, "Running AI on server...");

                const response = await fetch(info.srcUrl);
                const imageBlob = await response.blob();
                const formData = new FormData();
                formData.append('image', imageBlob);

                // 🟢 FIXED THE 404 ERROR HERE: Name matches the python server exactly!
                let endpoint = info.menuItemId === "upscale_png" ? "/upscale" : "/remove-background";
                if (info.menuItemId === "upscale_png") formData.append('scale', scale);

                // 🟢 FIXED THE 401 ERROR HERE: Uses Basic Token instead of Supabase Token!
                const apiRes = await fetch(`${API_CONFIG.url}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${API_CONFIG.basicToken}` },
                    body: formData
                });

                if (!apiRes.ok) throw new Error(`Server Error: ${apiRes.statusText}`);

                const finalBlob = await apiRes.blob();
                const downloadUrl = await blobToDataUrl(finalBlob);

                let prefix = info.menuItemId === "upscale_png" ? `AnyPNG_Upscaled_${scale}x` : `AnyPNG_Transparent`;
                chrome.downloads.download({ url: downloadUrl, filename: `${prefix}_${Date.now()}.png` });

            } catch (error) {
                chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Failed', message: error.message });
            } finally {
                toggleLoadingScreen(tab.id, false);
            }
        });
    }

    // ==========================================
    // 🔄 LOCAL TOOL: PNG CONVERSION
    // ==========================================
    else if (info.menuItemId === "download_png") {
        try {
            toggleLoadingScreen(tab.id, true, "Converting image to PNG locally...");
            const response = await fetch(info.srcUrl);
            const blob = await response.blob();
            const fullDataUrl = await blobToDataUrl(blob);
            const base64Data = fullDataUrl.split(',')[1];

            await setupOffscreenDocument('pages/offscreen.html');
            const result = await chrome.runtime.sendMessage({ target: 'offscreen', action: 'convertToPng', data: base64Data, mimeType: blob.type });

            if (result.error) throw new Error(result.error);
            chrome.downloads.download({ url: `data:image/png;base64,${result.data}`, filename: `AnyPNG_Converted_${Date.now()}.png` });

        } catch (error) {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Conversion Failed', message: error.message });
        } finally {
            toggleLoadingScreen(tab.id, false);
        }
    }

    // ==========================================
    // 🎬 LOCAL TOOL: VIDEO DOWNLOAD
    // ==========================================
    else if (info.menuItemId === "download_video") {
        if (!info.srcUrl) {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Download Failed', message: 'No video source found on this element.' });
            return;
        }

        // blob:/mediasource: URLs are scoped to the page and can't be resolved
        // from the background service worker, so a direct download won't work.
        if (info.srcUrl.startsWith('blob:') || info.srcUrl.startsWith('mediasource:')) {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Unsupported Video', message: 'This video is streamed (blob URL) and cannot be downloaded directly.' });
            return;
        }

        const urlNoQuery = info.srcUrl.split(/[?#]/)[0];
        const rawExt = (urlNoQuery.split('.').pop() || '').toLowerCase();
        const ext = /^[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : 'mp4';

        chrome.downloads.download({ url: info.srcUrl, filename: `AnyPNG_Video_${Date.now()}.${ext}` }, () => {
            if (chrome.runtime.lastError) {
                chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Download Failed', message: chrome.runtime.lastError.message });
            }
        });
    }

    // ==========================================
    // 🎬 CLIENT-FIRST VIDEO DOWNLOAD (YouTube / Instagram / Facebook / TikTok)
    // ==========================================
    else if (info.menuItemId.startsWith("video_quality_")) {
        const quality = info.menuItemId.replace("video_quality_", "");
        await resolveVideoDownload(tab, quality);
    }
});

// Extract the Supabase access token from a session object (handles nested formats)
function getAccessToken(session) {
    if (!session) return null;
    if (session.access_token) return session.access_token;
    if (session.session && session.session.access_token) return session.session.access_token;
    return null;
}

// Helper Function specifically for the Watermark API
async function callWatermarkBackend(prompt, session, method = "standard") {
    // The deployed /remove-watermark endpoint authenticates the user via their
    // Supabase session JWT (to identify the account and deduct credits) — not the
    // static basic token. Use the access token from the already-validated session.
    const accessToken = getAccessToken(session);
    if (!accessToken) {
        await chrome.storage.local.set({ watermarkProcessing: false });
        chrome.runtime.sendMessage({ action: "SHOW_ERROR", error: "Session expired. Please open AnyPNG and log in again." }).catch(() => {
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Login Required', message: 'Please open AnyPNG and log in again.' });
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
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData
        });

        if (!apiRes.ok) {
            const errData = await apiRes.json();
            throw new Error(errData.detail || "Server error");
        }

        const finalBlob = await apiRes.blob();
        const base64Data = await blobToDataUrl(finalBlob);

        // Save to storage for the popup to read
        await chrome.storage.local.set({ lastWatermarkResult: base64Data, watermarkProcessing: false });

        // Notify popup if it's open
        chrome.runtime.sendMessage({ action: "UPDATE_PREVIEW", image: base64Data }).catch(() => {
            // If popup is closed, just show a notification
            chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Watermark Removed!', message: 'Click the AnyPNG icon to view the result.' });
        });

    } catch (error) {
        let userMessage = error.message || "Unknown error";
        const lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes("does not support image") ||
            lowerMsg.includes("cannot read image") ||
            lowerMsg.includes("image input") ||
            (lowerMsg.includes("model") && lowerMsg.includes("image"))) {
            userMessage = "This image format is not supported. Please try a different image (PNG, JPG, or WebP recommended).";
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

// UI Message listeners for the Pro Editor
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "RETRY_WATERMARK") {
        const supabaseSession = await getValidSession();
        if (supabaseSession) {
            const prompt = message.prompt || DEFAULT_PROMPT;
            const method = message.method || "standard";
            await callWatermarkBackend(prompt, supabaseSession, method);
        }
    } else if (message.action === "DOWNLOAD_RESULT") {
        chrome.downloads.download({ url: message.url, filename: `AnyPNG_Pro_Cleaned_${Date.now()}.png` });
    } else if (message.action === "DOWNLOAD_VIDEO") {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) await resolveVideoDownload(activeTab, message.quality, message.url);
    }
});
