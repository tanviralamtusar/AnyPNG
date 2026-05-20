// Create the Right-Click Menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "pro_image_tools", title: "AnyPNG", contexts: ["image"] });
    chrome.contextMenus.create({ id: "download_png", title: "Convert to PNG (Local)", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "upscale_png", title: "✨ Upscale & Download", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "watermark_png", title: "💎 Remove Watermark (Pro)", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "remove_bg_png", title: "✂️ Remove Background", parentId: "pro_image_tools", contexts: ["image"] });
});

// 🔒 API CONFIGURATION
const API_CONFIG = {
    url: "https://png.botbhai.net",
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
        .catch(() => { if (show) chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'AnyPNG', message: text }); });
}

// Listen for clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {

    // ==========================================
    // 💎 PRO TOOL: WATERMARK (Uses Supabase Token & In-Page Editor)
    // ==========================================
    if (info.menuItemId === "watermark_png") {
        const supabaseSession = await getValidSession();
        if (!supabaseSession) {
            chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'Login Required', message: 'Please click the AnyPNG icon in your toolbar to Login first!' });
            return;
        }

        currentTabId = tab.id;

        // Notify user that processing started
        chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'AnyPNG Processing', message: 'Removing watermark... Please wait.' });
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

            await callWatermarkBackend(DEFAULT_PROMPT, supabaseSession.access_token);
        } catch (e) {
            chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'Error', message: "Failed to fetch image: " + e.message });
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
                chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'Failed', message: error.message });
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
            chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'Conversion Failed', message: error.message });
        } finally {
            toggleLoadingScreen(tab.id, false);
        }
    }
});

// Helper Function specifically for the Watermark API
async function callWatermarkBackend(prompt, token, method = "standard") {
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

    const formData = new FormData();
    formData.append('image', blobToProcess);
    formData.append('prompt', prompt);
    formData.append('method', method);

    try {
        const apiRes = await fetch(`${API_CONFIG.url}/remove-watermark`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // Uses Supabase JWT securely!
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
            chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'Watermark Removed!', message: 'Click the AnyPNG icon to view the result.' });
        });

    } catch (error) {
        await chrome.storage.local.set({ watermarkProcessing: false });
        
        let userMessage = error.message || "Unknown error";
        const lowerMsg = userMessage.toLowerCase();
        
        // Check for model/image input errors
        if (lowerMsg.includes("does not support image") || 
            lowerMsg.includes("cannot read image") || 
            lowerMsg.includes("image input") ||
            lowerMsg.includes("model") && lowerMsg.includes("image")) {
            userMessage = "This image format is not supported. Please try a different image (PNG, JPG, or WebP recommended).";
        } else if (lowerMsg.includes("failed to fetch") || lowerMsg.includes("network")) {
            userMessage = "Network error. Please check your connection and try again.";
        }
        
        console.error("Watermark API Error:", error);
        
        // Clear processing state and notify UI
        await chrome.storage.local.remove('watermarkProcessing');
        
        chrome.runtime.sendMessage({ action: "SHOW_ERROR", error: userMessage }).catch(() => {
            chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'Error', message: userMessage });
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
            await callWatermarkBackend(prompt, supabaseSession.access_token, method);
        }
    } else if (message.action === "DOWNLOAD_RESULT") {
        chrome.downloads.download({ url: message.url, filename: `AnyPNG_Pro_Cleaned_${Date.now()}.png` });
    }
});
