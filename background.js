// Create the Right-Click Menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "pro_image_tools", title: "AnyPNG", contexts: ["image"] });
    chrome.contextMenus.create({ id: "download_png", title: "Download as PNG (Local)", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "upscale_png", title: "✨ Upscale & Download", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "watermark_png", title: "💧 Remove Watermark", parentId: "pro_image_tools", contexts: ["image"] });
    chrome.contextMenus.create({ id: "remove_bg_png", title: "✂️ Remove Background", parentId: "pro_image_tools", contexts: ["image"] });
});

// Hardcoded API Credentials
const CONFIG = {
    vpsUrl: "https://png.botbhai.net",
    securityToken: "my_super_secret_hostinger_token_123!"
};

// Listen for clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const aiActions = ["upscale_png", "watermark_png", "remove_bg_png"];

    if (aiActions.includes(info.menuItemId)) {
        // 1. Get Settings from Options Page (Only upscale factor is truly dynamic now)
        chrome.storage.sync.get(['upscaleFactor'], async (settings) => {

            try {
                chrome.notifications.create({ type: 'basic', iconUrl: 'icon16.png', title: 'Processing', message: 'Sending image to your VPS AI... Please wait.' });

                // 2. Fetch the image from the website
                const response = await fetch(info.srcUrl);
                const imageBlob = await response.blob();

                // 3. Build the payload
                const formData = new FormData();
                formData.append('image', imageBlob);

                // 4. Route to the correct API Endpoint & apply the scale setting
                let endpoint = "";
                if (info.menuItemId === "upscale_png") {
                    endpoint = "/upscale";
                    // Pass the scale from settings (default to 2 if they haven't saved options yet)
                    formData.append('scale', settings.upscaleFactor || '2');
                } else if (info.menuItemId === "watermark_png") {
                    endpoint = "/remove-watermark";
                } else if (info.menuItemId === "remove_bg_png") {
                    endpoint = "/remove-background";
                }

                // 5. Send to your Coolify Server
                const apiRes = await fetch(`${CONFIG.vpsUrl}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${CONFIG.securityToken}` },
                    body: formData
                });

                if (!apiRes.ok) throw new Error(`Server Error: ${apiRes.statusText}`);

                // 6. Download the finished image
                const finalBlob = await apiRes.blob();
                const downloadUrl = URL.createObjectURL(finalBlob);

                chrome.downloads.download({
                    url: downloadUrl,
                    filename: `AI_Edited_${Date.now()}.png`
                });

            } catch (error) {
                chrome.notifications.create({ type: 'basic', iconUrl: 'icon16.png', title: 'AI Failed', message: error.message });
            }
        });
    } else if (info.menuItemId === "download_png") {
        // Standard Local PNG Download logic here (if needed)
        chrome.downloads.download({ url: info.srcUrl });
    }
});
