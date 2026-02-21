// Create the Right-Click Menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "pro_image_tools", title: "AnyPNG", contexts: ["image"] });
    chrome.contextMenus.create({ id: "download_png", title: "Convert to PNG (Local)", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "upscale_png", title: "✨ Upscale & Download", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "watermark_png", title: "💧 Remove Watermark", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "remove_bg_png", title: "✂️ Remove Background", parentId: "pro_image_tools", contexts: ["image"] });
});

// 🔒 HARDCODED API CREDENTIALS
const API_CONFIG = {
    url: "https://png.botbhai.net",
    token: "my_super_secret_hostinger_token_123!"
};

// SAFELY Convert Blob to Data URL (Handles HUGE files without corrupting them!)
const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});

// Helper: Setup Offscreen Document for local PNG conversion
async function setupOffscreenDocument(path) {
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [chrome.runtime.getURL(path)]
    });
    if (existingContexts.length > 0) return;
    await chrome.offscreen.createDocument({
        url: path,
        reasons: ['WORKERS'],
        justification: 'Image format conversion to PNG'
    });
}

// Helper: Show/Hide Loading Screen on the active website
function toggleLoadingScreen(tabId, show, text = "") {
    chrome.tabs.sendMessage(tabId, {
        action: show ? "SHOW_LOADING" : "HIDE_LOADING",
        text: text
    }).catch(() => {
        // Fallback: If website blocks content script, just use standard notification
        if (show) chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'AnyPNG Processing', message: text });
    });
}

// Listen for clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    const aiActions = ["upscale_png", "watermark_png", "remove_bg_png"];

    if (aiActions.includes(info.menuItemId)) {
        // --- AI VPS PROCESSING LOGIC ---
        chrome.storage.sync.get(['upscaleFactor'], async (settings) => {
            const scale = settings.upscaleFactor || '2';

            try {
                toggleLoadingScreen(tab.id, true, "Running AI model on your server...");

                const response = await fetch(info.srcUrl);
                const imageBlob = await response.blob();

                const formData = new FormData();
                formData.append('image', imageBlob);

                let endpoint = "";
                if (info.menuItemId === "upscale_png") {
                    endpoint = "/upscale";
                    formData.append('scale', scale);
                } else if (info.menuItemId === "watermark_png") {
                    endpoint = "/remove-watermark";
                } else if (info.menuItemId === "remove_bg_png") {
                    endpoint = "/remove-background";
                }

                const apiRes = await fetch(`${API_CONFIG.url}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${API_CONFIG.token}` },
                    body: formData
                });

                if (!apiRes.ok) throw new Error(`Server Error: ${apiRes.statusText}`);

                // Generate safe Base64 string from the massive AI image
                const finalBlob = await apiRes.blob();
                const downloadUrl = await blobToDataUrl(finalBlob);

                let prefix = "AnyPNG";
                if (info.menuItemId === "upscale_png") prefix += `_Upscaled_${scale}x`;
                if (info.menuItemId === "watermark_png") prefix += "_Cleaned";
                if (info.menuItemId === "remove_bg_png") prefix += "_Transparent";

                chrome.downloads.download({
                    url: downloadUrl,
                    filename: `${prefix}_${Date.now()}.png`
                });

            } catch (error) {
                chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'AnyPNG Failed', message: error.message });
            } finally {
                toggleLoadingScreen(tab.id, false); // Always hide loader
            }
        });
    } else if (info.menuItemId === "download_png") {
        // --- LOCAL PNG CONVERSION LOGIC (JPEG/WEBP -> PNG) ---
        try {
            toggleLoadingScreen(tab.id, true, "Converting image to PNG locally...");

            const response = await fetch(info.srcUrl);
            const blob = await response.blob();
            const mimeType = blob.type;

            // Strip the metadata from DataURL to send clean Base64 to offscreen
            const fullDataUrl = await blobToDataUrl(blob);
            const base64Data = fullDataUrl.split(',')[1];

            await setupOffscreenDocument('offscreen.html');

            const result = await chrome.runtime.sendMessage({
                target: 'offscreen',
                action: 'convertToPng',
                data: base64Data,
                mimeType: mimeType
            });

            if (result.error) throw new Error(result.error);

            const downloadUrl = `data:image/png;base64,${result.data}`;

            chrome.downloads.download({
                url: downloadUrl,
                filename: `AnyPNG_Converted_${Date.now()}.png`
            });

        } catch (error) {
            console.error("Local Conversion Error:", error);
            chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'Conversion Failed', message: error.message || 'Could not convert image.' });
        } finally {
            toggleLoadingScreen(tab.id, false); // Always hide loader
        }
    }
});
