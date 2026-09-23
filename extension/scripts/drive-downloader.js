// Google Drive folder downloader. This is intentionally isolated from the
// general content script because Drive's virtualized file list needs scanning.
(() => {
    if (window.top !== window || document.getElementById('anypng-drive-downloader-host')) return;

    // Drive exposes these files through the same per-file download endpoint.
    // Keep this extension list explicit so documents and folders are never
    // accidentally queued when a user only wants media.
    const MEDIA_EXTENSIONS = /\.(?:mp4|m4v|mov|avi|mkv|webm|wmv|flv|f4v|mpeg|mpg|3gp|3g2|mts|m2ts|ts|m2v|vob|ogv|ogm|asf|rm|rmvb|divx|dv|jpg|jpeg|jpe|png|gif|webp|avif|bmp|tif|tiff|svg|heic|heif|ico|raw|cr2|nef|arw|dng)$/i;
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    let running = false;
    let stopRequested = false;

    const host = document.createElement('div');
    host.id = 'anypng-drive-downloader-host';
    host.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483647;font:13px/1.35 Arial,sans-serif';
    const shadow = host.attachShadow({ mode: 'closed' });
    shadow.innerHTML = `
      <style>
        #box{width:290px;background:#202124;color:#f8f9fa;border-radius:12px;padding:14px 15px;box-shadow:0 6px 24px #0008;transition:width .16s ease,padding .16s ease}
        #bar{display:flex;align-items:center;gap:8px;margin-bottom:6px;cursor:grab;user-select:none;touch-action:none}#bar:active{cursor:grabbing}h1{font-size:14px;margin:0;font-weight:600;flex:1}.version{font-size:10px;color:#9aa0a6;font-weight:400}.note{font-size:12px;color:#bdc1c6;margin:0 0 12px}#status{min-height:34px;color:#e8eaed;word-break:break-word}.actions{display:flex;gap:8px;margin-top:10px}button{border:0;border-radius:7px;padding:8px 10px;font-weight:600;cursor:pointer}#start{background:#8ab4f8;color:#202124}#stop{background:#3c4043;color:#f8f9fa}button:disabled{opacity:.55;cursor:wait}#minimize{width:24px;height:24px;padding:0;background:transparent;color:#bdc1c6;font-size:18px;line-height:1;cursor:pointer}#box.minimized{width:auto;padding:9px 11px}#box.minimized #bar{margin:0}#box.minimized #content{display:none}
      </style>
      <div id="box"><div id="bar"><h1>AnyPNG Drive Downloader <span class="version">v${chrome.runtime.getManifest().version}</span></h1><button id="minimize" type="button" title="Minimize panel" aria-label="Minimize panel">−</button></div><div id="content"><p class="note">Downloads each image or video separately through Chrome, without a ZIP.</p><div id="status">Open a Drive folder containing media, then start.</div><div class="actions"><button id="start">Download media</button><button id="stop" disabled>Stop</button></div></div></div>`;
    document.documentElement.append(host);

    const start = shadow.querySelector('#start');
    const stop = shadow.querySelector('#stop');
    const status = shadow.querySelector('#status');
    const box = shadow.querySelector('#box');
    const bar = shadow.querySelector('#bar');
    const minimize = shadow.querySelector('#minimize');
    const setStatus = text => { status.textContent = text; };
    const setControls = active => { start.disabled = active; stop.disabled = !active; };

    minimize.addEventListener('click', event => {
        event.stopPropagation();
        const isMinimized = box.classList.toggle('minimized');
        minimize.textContent = isMinimized ? '+' : '−';
        minimize.title = isMinimized ? 'Restore panel' : 'Minimize panel';
        minimize.setAttribute('aria-label', minimize.title);
    });

    bar.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.target === minimize) return;
        const rect = host.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        host.style.left = `${rect.left}px`;
        host.style.top = `${rect.top}px`;
        host.style.right = 'auto';
        host.style.bottom = 'auto';
        bar.setPointerCapture(event.pointerId);

        const move = moveEvent => {
            const maxLeft = Math.max(0, window.innerWidth - host.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - host.offsetHeight);
            host.style.left = `${Math.min(maxLeft, Math.max(0, moveEvent.clientX - offsetX))}px`;
            host.style.top = `${Math.min(maxTop, Math.max(0, moveEvent.clientY - offsetY))}px`;
        };
        const finish = () => {
            bar.removeEventListener('pointermove', move);
            bar.removeEventListener('pointerup', finish);
            bar.removeEventListener('pointercancel', finish);
        };
        bar.addEventListener('pointermove', move);
        bar.addEventListener('pointerup', finish);
        bar.addEventListener('pointercancel', finish);
    });

    function nameFrom(element) {
        const values = [element.getAttribute('data-tooltip'), element.getAttribute('aria-label'), element.title,
            ...[...element.querySelectorAll('[data-tooltip], [aria-label], [title]')].slice(0, 12).flatMap(child => [child.getAttribute('data-tooltip'), child.getAttribute('aria-label'), child.title]),
            element.innerText].filter(Boolean);
        for (const value of values) {
            const match = String(value).match(/[^\n\\/]+\.(?:mp4|m4v|mov|avi|mkv|webm|wmv|flv|mpeg|mpg|3gp|mts|m2ts)/i);
            if (match) return match[0].trim();
        }
        return null;
    }

    function captureMedia(found) {
        for (const element of document.querySelectorAll('[data-id]')) {
            const name = nameFrom(element);
            const id = element.getAttribute('data-id');
            if (!id || !name || !MEDIA_EXTENSIONS.test(name)) continue;
            const resourceKey = element.getAttribute('data-resource-key') || element.getAttribute('data-resourcekey') || '';
            found.set(id, { id, name, resourceKey });
        }
    }

    function scrollContainer() {
        const candidates = [document.scrollingElement];
        for (const file of document.querySelectorAll('[data-id]')) {
            for (let node = file; node && node !== document.body; node = node.parentElement) {
                if (!candidates.includes(node)) candidates.push(node);
            }
        }
        return candidates.filter(node => node && node.scrollHeight > node.clientHeight + 80)
            .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0] || document.scrollingElement;
    }

    async function scanFolder() {
        const found = new Map();
        const container = scrollContainer();
        const originalTop = container.scrollTop;
        let lastCount = -1;
        let stableAtBottom = 0;
        captureMedia(found);
        for (let step = 0; step < 240 && !stopRequested; step += 1) {
            container.scrollTop = Math.min(container.scrollTop + Math.max(500, container.clientHeight * .85), container.scrollHeight);
            container.dispatchEvent(new Event('scroll', { bubbles: true }));
            await sleep(550);
            captureMedia(found);
            if (step && step % 10 === 0) setStatus(`Scanning Drive folder... ${found.size} media files found`);
            const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5;
            stableAtBottom = atBottom ? (found.size === lastCount ? stableAtBottom + 1 : 0) : 0;
            if (stableAtBottom >= 4) break;
            lastCount = found.size;
        }
        container.scrollTop = originalTop;
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
        return [...found.values()];
    }

    start.addEventListener('click', async () => {
        if (running) return;
        running = true; stopRequested = false; setControls(true); setStatus('Scanning this Drive folder...');
        const files = await scanFolder();
        if (stopRequested) { running = false; setControls(false); setStatus('Stopped before downloads started.'); return; }
        if (!files.length) { running = false; setControls(false); setStatus('No supported images or videos found. Wait for the folder to finish loading, then try again.'); return; }
        setStatus(`Found ${files.length} media file${files.length === 1 ? '' : 's'}. Starting Chrome downloads...`);
        const response = await chrome.runtime.sendMessage({ action: 'START_DRIVE_VIDEO_QUEUE', files, folder: 'Drive media' });
        if (!response?.ok) { running = false; setControls(false); setStatus(response?.error || 'Could not start downloads.'); }
    });
    stop.addEventListener('click', async () => {
        stopRequested = true; await chrome.runtime.sendMessage({ action: 'STOP_DRIVE_VIDEO_QUEUE' });
        running = false; setControls(false); setStatus('Stopped. Downloads already started remain in Chrome.');
    });
    chrome.runtime.onMessage.addListener(message => {
        if (message?.action !== 'DRIVE_QUEUE_STATUS') return;
        if (message.state === 'downloading') setStatus(`Starting ${message.done + message.failed + 1}/${message.total}: ${message.name}`);
        if (message.state === 'finished') { running = false; setControls(false); setStatus(`Finished: ${message.done} started${message.failed ? `, ${message.failed} failed` : ''}. Check Chrome Downloads.`); }
    });
})();
