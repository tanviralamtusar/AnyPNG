chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "SHOW_LOADING") {
        let loader = document.getElementById("anypng-loading-overlay");
        if (!loader) {
            loader = document.createElement("div");
            loader.id = "anypng-loading-overlay";
            Object.assign(loader.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
                zIndex: '2147483647', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', color: '#f8fafc',
                fontFamily: 'system-ui, -apple-system, sans-serif', margin: '0', padding: '0'
            });
            loader.innerHTML = `
                <div style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #10b981; border-radius: 50%; animation: anypng-spin 1s linear infinite;"></div>
                <h2 style="margin-top: 24px; font-weight: 700; font-size: 24px; letter-spacing: 0.5px;">AnyPNG Processing</h2>
                <p style="color: #94a3b8; margin-top: 8px; font-size: 15px;">${message.text || "Please wait..."}</p>
                <style>@keyframes anypng-spin { to { transform: rotate(360deg); } }</style>
            `;
            document.body.appendChild(loader);
        }
    } else if (message.action === "HIDE_LOADING") {
        const loader = document.getElementById("anypng-loading-overlay");
        if (loader) loader.remove();
    }
});
