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

// Helper: Convert Blob to Base64 in Service Worker
async function blobToBase64(blob) {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

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

// Listen for clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    const aiActions = ["upscale_png", "watermark_png", "remove_bg_png"];

    // NOTE: Added iconUrl: 'icons/icon48.png' back in because Chrome requires it!
    if (aiActions.includes(info.menuItemId)) {
        // --- AI VPS PROCESSING LOGIC ---
        chrome.storage.sync.get(['upscaleFactor'], async (settings) => {
            const scale = settings.upscaleFactor || '2';

            try {
                chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'AnyPNG Processing', message: 'Sending image to AI... Please wait.' });

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

                // FIXED: Convert blob to base64 Data URI instead of using createObjectURL
                const finalBlob = await apiRes.blob();
                const base64Data = await blobToBase64(finalBlob);
                const downloadUrl = `data:image/png;base64,${base64Data}`;

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
            }
        });
    } else if (info.menuItemId === "download_png") {
        // --- LOCAL PNG CONVERSION LOGIC (JPEG/WEBP -> PNG) ---
        try {
            chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon48.png', title: 'AnyPNG', message: 'Converting image to PNG...' });

            const response = await fetch(info.srcUrl);
            const blob = await response.blob();
            const mimeType = blob.type;

            const base64Data = await blobToBase64(blob);

            await setupOffscreenDocument('offscreen.html');

            const result = await chrome.runtime.sendMessage({
                target: 'offscreen',
                action: 'convertToPng',
                data: base64Data,
                mimeType: mimeType
            });

            if (result.error) throw new Error(result.error);

            // FIXED: Download directly using the base64 string from offscreen.js
            const downloadUrl = `data:image/png;base64,${result.data}`;

            chrome.downloads.download({
                url: downloadUrl,
                filename: `AnyPNG_Converted_${Date.now()}.png`
            });

        } catch (error) {
            console.error("Local Conversion Error:", error);
            chrome.notifications.create({ type: 'basic', title: 'Conversion Failed', message: error.message || 'Could not convert image.' });
        }
    }
});
