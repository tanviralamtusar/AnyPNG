// Create the Right-Click Menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "pro_image_tools", title: "AnyPNG", contexts: ["image"] });
    chrome.contextMenus.create({ id: "download_png", title: "Download as PNG (Local)", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "upscale_png", title: "✨ Upscale & Download", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "watermark_png", title: "💧 Remove Watermark", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "remove_bg_png", title: "✂️ Remove Background", parentId: "pro_image_tools", contexts: ["image"] });
});

// 🔒 HARDCODED API CREDENTIALS
// The user never has to type these in. The extension just "magically" works.
const API_CONFIG = {
    url: "https://png.botbhai.net",
    token: "my_super_secret_hostinger_token_123!"
};

// Listen for clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const aiActions = ["upscale_png", "watermark_png", "remove_bg_png"];

    if (aiActions.includes(info.menuItemId)) {
        // Only fetch the Upscale Factor from the user's settings (Default is 2x)
        chrome.storage.sync.get(['upscaleFactor'], async (settings) => {
            const scale = settings.upscaleFactor || '2';

            try {
                chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon128.png', title: 'AnyPNG Processing', message: 'Sending image to AI... Please wait.' });

                // Fetch the image from the website
                const response = await fetch(info.srcUrl);
                const imageBlob = await response.blob();

                // Build the payload
                const formData = new FormData();
                formData.append('image', imageBlob);

                // Route to the correct API Endpoint
                let endpoint = "";
                if (info.menuItemId === "upscale_png") {
                    endpoint = "/upscale";
                    formData.append('scale', scale);
                } else if (info.menuItemId === "watermark_png") {
                    endpoint = "/remove-watermark";
                } else if (info.menuItemId === "remove_bg_png") {
                    endpoint = "/remove-background";
                }

                // Send to your Coolify Server using the hardcoded credentials
                const apiRes = await fetch(`${API_CONFIG.url}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${API_CONFIG.token}` },
                    body: formData
                });

                if (!apiRes.ok) throw new Error(`Server Error: ${apiRes.statusText}`);

                // Download the finished image
                const finalBlob = await apiRes.blob();
                const downloadUrl = URL.createObjectURL(finalBlob);

                // Generate a clean filename based on the action
                let prefix = "AnyPNG";
                if (info.menuItemId === "upscale_png") prefix += `_Upscaled_${scale}x`;
                if (info.menuItemId === "watermark_png") prefix += "_Cleaned";
                if (info.menuItemId === "remove_bg_png") prefix += "_Transparent";

                chrome.downloads.download({
                    url: downloadUrl,
                    filename: `${prefix}_${Date.now()}.png`
                });

            } catch (error) {
                chrome.notifications.create({ type: 'basic', iconUrl: 'icons/icon128.png', title: 'AnyPNG Failed', message: error.message });
            }
        });
    } else if (info.menuItemId === "download_png") {
        // Standard Local PNG Download logic
        chrome.downloads.download({ url: info.srcUrl });
    }
});
