// Local (offscreen-canvas) image conversion targets. `download_<key>` is the
// context-menu id for each; `lossy` decides whether the saved quality setting applies.
const IMAGE_FORMATS = {
    png:  { name: "PNG",  label: "Convert to PNG (Local)",  mimeType: "image/png",  ext: "png",  lossy: false },
    webp: { name: "WebP", label: "Convert to WebP (Local)", mimeType: "image/webp", ext: "webp", lossy: true },
    avif: { name: "AVIF", label: "Convert to AVIF (Local)", mimeType: "image/avif", ext: "avif", lossy: true },
};

// Quality passed to the canvas encoder for lossy targets. 1 makes Chrome pick
// lossless WebP; AVIF stays lossy at every value.
const DEFAULT_CONVERSION_QUALITY = 0.9;

// "download_png" -> "png"; returns null for anything that isn't a local
// conversion item (notably "download_video", which shares the prefix).
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

// Create the Right-Click Menus
chrome.runtime.onInstalled.addListener(() => {
    // removeAll first: on an extension update the previously registered items are
    // still around, and re-creating an existing id fails with "duplicate id".
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({ id: "pro_image_tools", title: "AnyPNG", contexts: ["image"] });
        Object.entries(IMAGE_FORMATS).forEach(([key, { label }]) => {
            chrome.contextMenus.create({ id: `download_${key}`, title: label, parentId: "pro_image_tools", contexts: ["image"] });
        });
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

// Cookie auth for the server-side fallback. YouTube only: it's the only platform
// whose backend path hits a bot-check wall ("Sign in to confirm you're not a bot"),
// because the server runs from a datacenter IP while the client-side steps run from
// the user's own. Deliberately excludes google.com — those cookies unlock the whole
// Google account, not just YouTube.
const PLATFORM_COOKIE_DOMAINS = { youtube: ["youtube.com"] };

const NETSCAPE_COOKIE_HEADER = "# Netscape HTTP Cookie File";

async function hasCookiePermission() {
    try {
        return await chrome.permissions.contains({ permissions: ["cookies"] });
    } catch (e) {
        return false;
    }
}

// Serializes the user's cookies for `platform` into the Netscape format yt-dlp reads.
// Returns null whenever we shouldn't or can't produce one — the caller treats that as
// "no cookie retry available" rather than an error.
async function buildNetscapeCookieFile(platform) {
    const domains = PLATFORM_COOKIE_DOMAINS[platform];
    if (!domains) return null;
    if (!(await hasCookiePermission())) return null;

    const rows = [];
    for (const domain of domains) {
        // The `domain` filter already matches subdomains (www./m./.youtube.com).
        const cookies = await chrome.cookies.getAll({ domain });
        for (const c of cookies) {
            // A tab or newline in a name/value would shift every later field and
            // produce a file yt-dlp silently mis-parses. Drop those rows instead.
            if (/[\t\r\n]/.test(c.name) || /[\t\r\n]/.test(c.value)) continue;
            rows.push([
                c.domain,
                c.hostOnly ? "FALSE" : "TRUE",
                c.path,
                c.secure ? "TRUE" : "FALSE",
                Math.floor(c.expirationDate || 0), // session cookies -> 0
                c.name,
                c.value,
            ].join("\t"));
        }
    }

    if (rows.length === 0) return null;
    return `${NETSCAPE_COOKIE_HEADER}\n${rows.join("\n")}\n`;
}

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

// Best-effort, deliberately conservative: only flags the CLEAR-CUT non-video cases
// (bare domain root, known feed/browse tabs) rather than trying to allowlist every
// valid video-URL shape — a positive allowlist risks blocking legitimate videos
// whose URL shape wasn't anticipated (Facebook especially has many valid forms:
// /watch/?v=, /<page>/videos/<id>, /reel/<id>, fb.watch/<code>, Marketplace/Live,
// etc.). Anything not matched here just proceeds through the normal cascade as
// before. Expect to refine these patterns as more real failure cases surface.
const OBVIOUSLY_NOT_A_VIDEO_PATTERNS = {
    youtube: [
        /^https?:\/\/(www\.|m\.)?youtube\.com\/?(\?.*)?$/i,
        /^https?:\/\/(www\.|m\.)?youtube\.com\/(feed|results|channel|c|@)(\/|$|\?)/i,
    ],
    instagram: [
        /^https?:\/\/(www\.)?instagram\.com\/?(\?.*)?$/i,
        /^https?:\/\/(www\.)?instagram\.com\/(explore|direct|accounts)(\/|$|\?)/i,
    ],
    facebook: [
        /^https?:\/\/(www\.|m\.)?facebook\.com\/?(\?.*)?$/i,
        /^https?:\/\/(www\.|m\.)?facebook\.com\/(home|feed|marketplace|groups|friends|notifications)(\/|$|\?)/i,
    ],
    tiktok: [
        /^https?:\/\/(www\.)?tiktok\.com\/?(\?.*)?$/i,
        /^https?:\/\/(www\.)?tiktok\.com\/(foryou|following|explore|live)(\/|$|\?)/i,
    ],
};

function isObviouslyNotAVideoPage(platform, url) {
    const patterns = OBVIOUSLY_NOT_A_VIDEO_PATTERNS[platform];
    if (patterns && patterns.some((re) => re.test(url))) return true;

    // Facebook's /watch is the videos-browse tab UNLESS it has a ?v= param (a
    // specific video) — parsed properly rather than a fragile regex lookahead.
    if (platform === "facebook") {
        try {
            const u = new URL(url);
            if (/^\/watch\/?$/.test(u.pathname) && !u.searchParams.has("v")) return true;
        } catch (e) { /* ignore */ }
    }
    return false;
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
    chrome.contextMenus.onShown.addListener(async (info, tab) => {
        const isSupportedPlatform = !!detectVideoPlatform(info.pageUrl || (tab && tab.url));
        // update() is async — must resolve before refresh() or the menu can render
        // with stale visibility (both items showing at once).
        await Promise.all([
            chrome.contextMenus.update("download_video", { visible: !isSupportedPlatform }),
            chrome.contextMenus.update("video_download_tools", { visible: isSupportedPlatform }),
        ]);
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
        serverAuth: "Downloaded via server (signed in) ✓",
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

// Posts one download attempt. Returns { ok: true, blob } on success, or
// { ok: false, code, message } on failure — `code` is the backend's structured
// error code when it sent one ("auth_required"), otherwise null.
async function postVideoDownload(url, quality, cookiesText) {
    const formData = new FormData();
    formData.append('url', url);
    formData.append('quality', quality || 'best');
    if (cookiesText) formData.append('cookies', cookiesText);

    const apiRes = await fetch(`${API_CONFIG.url}/download-video`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_CONFIG.basicToken}` },
        body: formData,
    });

    if (apiRes.ok) return { ok: true, blob: await apiRes.blob() };

    // statusText is frequently empty on HTTP/2 responses in Chrome, so fall back
    // to the numeric status (and a snippet of the raw body if it wasn't JSON) —
    // otherwise failures collapse into an unhelpful bare "Server error:".
    const rawBody = await apiRes.text().catch(() => "");
    let detail = null;
    try { detail = JSON.parse(rawBody).detail; } catch (e) { /* not JSON */ }

    // FastAPI's `detail` is a plain string almost everywhere, but /download-video
    // returns an object for errors the client can act on. Without this, an object
    // detail would stringify into a useless "[object Object]".
    let code = null;
    let message = null;
    if (detail && typeof detail === 'object') {
        code = detail.code || null;
        message = detail.message || null;
    } else if (typeof detail === 'string') {
        message = detail;
    }

    const bodySnippet = rawBody && !message ? ` — ${rawBody.slice(0, 200)}` : "";
    return {
        ok: false,
        code,
        message: message || `Server error: HTTP ${apiRes.status} ${apiRes.statusText}${bodySnippet}`,
    };
}

async function downloadViaBackend(tab, quality, platform) {
    toggleLoadingScreen(tab.id, true, "Downloading via server...");

    let result = await postVideoDownload(tab.url, quality, null);
    let usedCookies = false;

    // The server hit a sign-in wall. It runs from a datacenter IP, so YouTube asks
    // it to prove it isn't a bot even though the user is signed in right here. Retry
    // once with the user's own cookies — but only if they opted in AND the optional
    // permission is actually held. Never escalate silently.
    if (!result.ok && result.code === 'auth_required') {
        const { enableCookieAuth } = await chrome.storage.local.get('enableCookieAuth');
        const cookiesText = enableCookieAuth ? await buildNetscapeCookieFile(platform) : null;

        if (cookiesText) {
            toggleLoadingScreen(tab.id, true, "Retrying with your sign-in...");
            result = await postVideoDownload(tab.url, quality, cookiesText);
            usedCookies = true;
        } else if (!enableCookieAuth) {
            throw new Error(`${result.message} You can enable "Use my YouTube sign-in for server downloads" in AnyPNG settings to retry these automatically.`);
        }
    }

    if (!result.ok) throw new Error(result.message);

    const dataUrl = await blobToDataUrl(result.blob);
    const ext = quality === 'audio' ? 'mp3' : 'mp4';
    chrome.downloads.download({ url: dataUrl, filename: `AnyPNG_${platform}_${Date.now()}.${ext}` });
    notifyVideoDownloadSource(usedCookies ? "serverAuth" : "server");
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

    // Catches the common mistake of right-clicking a video still embedded in a feed
    // (e.g. Facebook's main feed never updates the address bar to the video's own
    // URL) — sending that bare page URL to the cascade/backend would otherwise fail
    // with a confusing "Unsupported URL" error instead of clear guidance.
    if (isObviouslyNotAVideoPage(platform, pageUrl)) {
        chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'AnyPNG', message: "This looks like a feed or home page, not a specific video. Open the video's own page first, then try again." });
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
            const result = await chrome.runtime.sendMessage({
                target: 'offscreen',
                action: 'convertImage',
                data: base64Data,
                mimeType: blob.type,
                targetType: format.mimeType,
                quality: format.lossy ? await getConversionQuality() : undefined
            });

            if (result.error) throw new Error(result.error);
            chrome.downloads.download({ url: `data:${format.mimeType};base64,${result.data}`, filename: `AnyPNG_Converted_${Date.now()}.${format.ext}` });

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
        // If this is one of the four platforms with dedicated handling, delegate to
        // the capture/remux/backend cascade instead of just failing — this also
        // covers the case where the quality submenu (see below) didn't show for
        // whatever reason and the user only had this generic item to click.
        if (info.srcUrl.startsWith('blob:') || info.srcUrl.startsWith('mediasource:')) {
            if (detectVideoPlatform(tab.url)) {
                const { defaultVideoQuality } = await chrome.storage.sync.get('defaultVideoQuality');
                await resolveVideoDownload(tab, defaultVideoQuality || 'best');
            } else {
                chrome.notifications.create({ type: 'basic', iconUrl: ICON_URL, title: 'Unsupported Video', message: 'This video is streamed (blob URL) and cannot be downloaded directly.' });
            }
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
