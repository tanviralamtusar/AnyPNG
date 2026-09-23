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
                <h2 style="margin-top: 24px; font-weight: 700; font-size: 24px; letter-spacing: 0.5px;">RightMate Processing</h2>
                <p style="color: #94a3b8; margin-top: 8px; font-size: 15px;">${message.text || "Please wait..."}</p>
                <style>@keyframes anypng-spin { to { transform: rotate(360deg); } }</style>
            `;
            document.body.appendChild(loader);
        }
    } else if (message.action === "HIDE_LOADING") {
        const loader = document.getElementById("anypng-loading-overlay");
        if (loader) loader.remove();
    } else if (message.action === "GET_VIDEO_SRC") {
        const video = document.querySelector("video");
        sendResponse({ src: video ? video.currentSrc : null });
        return true;
    } else if (message.action === "GET_IMAGE_AT_POINT") {
        const x = Number.isFinite(message.x) ? message.x : window.innerWidth / 2;
        const y = Number.isFinite(message.y) ? message.y : window.innerHeight / 2;
        const distance = (image) => {
            const box = image.getBoundingClientRect();
            const dx = Math.max(box.left - x, 0, x - box.right);
            const dy = Math.max(box.top - y, 0, y - box.bottom);
            return dx * dx + dy * dy;
        };
        const images = [...document.images].filter(image => {
            const box = image.getBoundingClientRect();
            return box.width > 32 && box.height > 32 && getComputedStyle(image).visibility !== 'hidden';
        }).sort((a, b) => distance(a) - distance(b));
        const imageCandidates = (image) => {
            const values = [
                image.currentSrc,
                image.src,
                image.getAttribute('data-src'),
                image.getAttribute('data-original'),
                image.getAttribute('data-lazy-src'),
                ...(image.getAttribute('srcset') || '').split(',').map(value => value.trim().split(/\s+/)[0]),
            ];
            return values.filter(value => value && !value.startsWith('data:')).map(value => {
                try { return new URL(value, location.href).href; } catch (_) { return null; }
            }).filter(Boolean);
        };
        const imageUrls = images.flatMap(imageCandidates);
        if (imageUrls.length > 0) {
            sendResponse({ srcs: [...new Set(imageUrls)] });
            return true;
        }
        const backgrounds = [...document.querySelectorAll('*')].map(node => {
            const box = node.getBoundingClientRect();
            const match = getComputedStyle(node).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            return { url: match?.[1], area: box.width * box.height };
        }).filter(item => item.url && item.area > 1024).sort((a, b) => b.area - a.area);
        sendResponse({ srcs: backgrounds[0]?.url ? [new URL(backgrounds[0].url, location.href).href] : [] });
        return true;
    } else if (message.action === "NUDGE_VIDEO_PLAYBACK") {
        const video = document.querySelector("video");
        if (!video) {
            sendResponse({ ok: false });
            return true;
        }
        const wasMuted = video.muted;
        const wasPaused = video.paused;
        video.muted = true;
        video.play().catch(() => { });
        setTimeout(() => {
            if (wasPaused) video.pause();
            video.muted = wasMuted;
            sendResponse({ ok: true });
        }, 1200);
        return true;
    }
});
