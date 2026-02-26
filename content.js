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
    } else if (message.action === "SHOW_PRO_EDITOR") {
        let editor = document.getElementById("anypng-pro-editor");
        if (!editor) {
            editor = document.createElement("div");
            editor.id = "anypng-pro-editor";
            Object.assign(editor.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                zIndex: '2147483647', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif'
            });

            editor.innerHTML = `
                <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; width: 450px; padding: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                    <h2 style="margin: 0 0 15px 0; color: white;">💎 Pro Watermark Remover</h2>
                    
                    <div id="anypng-preview-box" style="width: 100%; height: 250px; background: #0f172a; border-radius: 8px; display: flex; justify-content: center; align-items: center; overflow: hidden; margin-bottom: 15px;">
                        <div id="anypng-spinner" style="color: #10b981; font-weight: bold;">Loading AI...</div>
                        <img id="anypng-result-img" style="display: none; max-width: 100%; max-height: 100%; object-fit: contain;" />
                    </div>

                    <label style="color: #94a3b8; font-size: 13px;">Advanced AI Prompt (Optional)</label>
                    <textarea id="anypng-prompt" rows="2" style="width: 100%; background: #0f172a; border: 1px solid #334155; color: white; padding: 8px; border-radius: 6px; box-sizing: border-box; margin-top: 5px;" placeholder="E.g., Remove watermark but keep the gold lion logo intact."></textarea>

                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button id="anypng-close" style="flex: 1; padding: 10px; background: #334155; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
                        <button id="anypng-retry" disabled style="flex: 1; padding: 10px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; opacity: 0.5;">🔄 Retry (1 Credit)</button>
                        <button id="anypng-download" disabled style="flex: 1.5; padding: 10px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; opacity: 0.5;">Download</button>
                    </div>
                </div>
            `;
            document.body.appendChild(editor);

            document.getElementById("anypng-close").onclick = () => editor.remove();
            
            document.getElementById("anypng-retry").onclick = () => {
                const prompt = document.getElementById("anypng-prompt").value;
                document.getElementById("anypng-result-img").style.display = "none";
                document.getElementById("anypng-spinner").style.display = "block";
                document.getElementById("anypng-spinner").innerText = "Generating new variation...";
                document.getElementById("anypng-retry").disabled = true;
                document.getElementById("anypng-download").disabled = true;
                chrome.runtime.sendMessage({ action: "RETRY_WATERMARK", prompt: prompt });
            };

            document.getElementById("anypng-download").onclick = () => {
                const imgUrl = document.getElementById("anypng-result-img").src;
                chrome.runtime.sendMessage({ action: "DOWNLOAD_RESULT", url: imgUrl });
                editor.remove();
            };
        }
    } else if (message.action === "UPDATE_PREVIEW") {
        document.getElementById("anypng-spinner").style.display = "none";
        document.getElementById("anypng-result-img").src = message.image;
        document.getElementById("anypng-result-img").style.display = "block";
        document.getElementById("anypng-retry").disabled = false;
        document.getElementById("anypng-retry").style.opacity = "1";
        document.getElementById("anypng-download").disabled = false;
        document.getElementById("anypng-download").style.opacity = "1";
    } else if (message.action === "SHOW_ERROR") {
        document.getElementById("anypng-spinner").innerText = message.error;
        document.getElementById("anypng-spinner").style.color = "#ef4444";
    }
});
