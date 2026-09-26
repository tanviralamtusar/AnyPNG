// Google Drive folder downloader. This is intentionally isolated from the
// general content script because Drive's virtualized file list needs scanning.
(() => {
    if (window.top !== window || document.getElementById('anypng-drive-downloader-host')) return;

    // Drive exposes these files through the same per-file download endpoint.
    // Keep these lists explicit so folders and Drive-native documents without
    // an exportable filename are never accidentally queued.
    const VIDEO_EXTENSIONS = /\.(?:mp4|m4v|mov|avi|mkv|webm|wmv|flv|f4v|mpeg|mpg|3gp|3g2|mts|m2ts|ts|m2v|vob|ogv|ogm|asf|rm|rmvb|divx|dv)$/i;
    const IMAGE_EXTENSIONS = /\.(?:jpg|jpeg|jpe|png|gif|webp|avif|bmp|tif|tiff|svg|heic|heif|ico|raw|cr2|nef|arw|dng)$/i;
    const OTHER_FILE_EXTENSIONS = /\.(?:pdf|txt|rtf|md|doc|docx|xls|xlsx|xlsm|csv|tsv|ppt|pptx|odp|odt|ods|epub|mobi|mp3|wav|flac|aac|ogg|oga|opus|m4a|wma|aiff|zip|rar|7z|tar|gz|bz2|xz|iso|dmg|exe|msi|apk|deb|rpm|ttf|otf|woff|woff2|json|xml|yaml|yml|sql|html|css|js|ts|py|java|c|cpp|h|sh)$/i;
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    let running = false;
    let stopRequested = false;
    let activity = null;
    let scannedFiles = [];
    let selectedFilter = 'all';
    let destinationFolder = 'Drive media';
    let downloadConcurrency = 3;

    const host = document.createElement('div');
    host.id = 'anypng-drive-downloader-host';
    host.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483647;font:13px/1.35 Arial,sans-serif';
    const shadow = host.attachShadow({ mode: 'closed' });
    shadow.innerHTML = `
      <style>
        *{box-sizing:border-box}#box{width:590px;color:#f5f7fb;border:1px solid #25334a;border-radius:24px;padding:25px;background:radial-gradient(80% 65% at 95% 0%,rgba(39,100,255,.14),transparent 62%),#070b12;box-shadow:0 18px 45px rgba(0,0,0,.34);font:14px/1.45 Inter,system-ui,sans-serif;transition:width .16s ease,padding .16s ease}#bar{display:flex;align-items:center;gap:10px;margin-bottom:24px;cursor:grab;user-select:none;touch-action:none}#bar:active{cursor:grabbing}h1{font-size:24px;letter-spacing:-.6px;margin:0;font-weight:700;flex:1}h1:before{content:'◢';display:inline-grid;place-items:center;width:36px;height:36px;margin-right:11px;background:#f4f7ff;color:#0c1421;border-radius:10px;font-size:21px;vertical-align:middle}.version{display:inline-block;margin-left:10px;padding:5px 11px;border:1px solid rgba(61,130,255,.22);border-radius:9px;color:#a8b9d9;background:rgba(39,100,255,.09);font-size:12px;font-weight:500}.note{min-height:112px;margin:0 0 16px;padding:61px 23px 18px 148px;border:1px solid rgba(95,125,170,.23);border-radius:18px;background:linear-gradient(135deg,rgba(20,30,47,.96),rgba(11,17,27,.96));color:#a8b4c8;font-size:15px;line-height:1.55;position:relative}.note:before{content:'△';position:absolute;left:31px;top:29px;display:grid;place-items:center;width:76px;height:76px;border:1px solid rgba(61,130,255,.18);border-radius:50%;color:#3d82ff;background:rgba(39,100,255,.09);font-size:47px}.note:after{content:'Scan first, then download selected files';position:absolute;top:22px;left:148px;color:#f5f7fb;font-size:19px;font-weight:700;letter-spacing:-.25px}#status{min-height:91px;padding:51px 22px 16px 122px;border:1px solid rgba(95,125,170,.23);border-radius:18px;background:linear-gradient(180deg,rgba(20,30,47,.96),rgba(11,17,27,.96));color:#a8b4c8;word-break:break-word;font-size:14px;position:relative}#status:before{content:'Scan complete';position:absolute;top:22px;left:122px;color:#9fb1d4;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}#status:after{content:'▧';position:absolute;left:29px;top:25px;display:grid;place-items:center;width:55px;height:55px;border:1px solid rgba(61,130,255,.22);border-radius:14px;background:rgba(39,100,255,.09);color:#3d82ff;font-size:28px}.filters{display:grid;grid-template-columns:repeat(2,1fr);gap:0;height:57px;margin:17px 0 0;border:1px solid #31425f;border-radius:15px;overflow:hidden;background:#0e1623}.filters button{border:0;border-radius:0;background:transparent;border-right:1px solid rgba(118,146,190,.18);color:#a8b4c8;font-size:15px}.filters button:last-child{border-right:0}.filters button.selected{background:linear-gradient(180deg,#2f7bff,#1e5fff);color:white;box-shadow:0 8px 22px rgba(32,94,255,.24)}.actions{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}button{height:57px;border:1px solid #31415c;border-radius:14px;padding:0 15px;font-weight:600;cursor:pointer;font-size:15px;transition:filter .16s ease,transform .16s ease}button:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px)}#scan{background:#101927;color:#f5f7fb}#start{background:linear-gradient(180deg,#2f7bff,#1e5fff);border-color:rgba(255,255,255,.08);color:#fff;box-shadow:0 8px 22px rgba(32,94,255,.24)}#stop{background:#381923;color:#ffb6c3;border-color:#833548}button:disabled{opacity:.55;cursor:wait}.hidden{display:none!important}#minimize{width:28px;height:28px;padding:0;background:transparent;border:0;color:#dbe5f7;font-size:20px;line-height:1}#box.minimized{width:auto;padding:12px 15px}#box.minimized #bar{margin:0}#box.minimized #content{display:none}@media(max-width:650px){#box{width:min(590px,calc(100vw - 24px))}.note{padding-left:20px;padding-top:61px}.note:after{left:20px;top:19px;font-size:16px}.note:before{display:none}#status{padding-left:22px;padding-top:48px}#status:before{left:22px}}
        #box{width:640px}#box:not(.results) #status:before{content:'Ready to scan'}h1:before{display:none}h1 img{width:36px;height:36px;margin-right:11px;border-radius:10px;vertical-align:middle}.note:before{content:'';background-color:rgba(39,100,255,.09);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233d82ff' stroke-width='1.8' stroke-linejoin='round'%3E%3Cpath d='M8.4 3h7.2L22 14.1l-3.6 6.2H5.6L2 14.1 8.4 3Z'/%3E%3Cpath d='m8.4 3 6.4 11.1H22M2 14.1h12.8l3.6 6.2'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;background-size:43px}#status:after{content:'';background-color:rgba(39,100,255,.09);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233d82ff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z'/%3E%3Cpath d='M14 2v6h6M8 13h8M8 17h5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;background-size:28px}
        @media(max-width:700px){#box{width:min(640px,calc(100vw - 24px))}}
      </style>
      <div id="box"><div id="bar"><h1>RightMate Drive Downloader <span class="version">v${chrome.runtime.getManifest().version}</span></h1><button id="minimize" type="button" title="Minimize panel" aria-label="Minimize panel">−</button></div><div id="content"><p class="note">Scan first, then download selected files separately through Chrome. Configure the destination and download limit in RightMate Settings.</p><div id="status">Scan this Drive folder to find downloadable files.</div><div class="filters hidden" role="group" aria-label="File type"><button data-filter="all" disabled>All (0)</button><button data-filter="video" disabled>Videos (0)</button><button data-filter="image" disabled>Images (0)</button><button data-filter="other" disabled>Other (0)</button></div><div class="actions"><button id="scan">Scan folder</button><button id="start" class="hidden" disabled>Download selected</button><button id="stop" class="hidden" disabled>Stop</button></div></div></div>`;
    document.documentElement.append(host);
    const panelTitle = shadow.querySelector('h1');
    panelTitle.innerHTML = `<img src="${chrome.runtime.getURL('icons/Anypng.png')}" alt="">Right<span style="color:#3d82ff">Mate</span> Drive Downloader <span class="version">v${chrome.runtime.getManifest().version}</span>`;
    shadow.querySelector('.note').textContent = 'Scan your Google Drive folder, then download the selected files separately through Chrome. Configure destination and limits in RightMate Settings.';

    const applyDrivePreferences = values => {
        if (typeof values.driveDownloadFolder === 'string' && values.driveDownloadFolder.trim()) {
            destinationFolder = values.driveDownloadFolder;
        }
        const limit = Number.parseInt(values.driveDownloadConcurrency, 10);
        if (Number.isFinite(limit)) downloadConcurrency = Math.min(5, Math.max(1, limit));
    };
    chrome.storage.sync.get(['driveDownloadFolder', 'driveDownloadConcurrency'], applyDrivePreferences);
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'sync') return;
        applyDrivePreferences({
            driveDownloadFolder: changes.driveDownloadFolder?.newValue,
            driveDownloadConcurrency: changes.driveDownloadConcurrency?.newValue
        });
    });

    const start = shadow.querySelector('#start');
    const scan = shadow.querySelector('#scan');
    const stop = shadow.querySelector('#stop');
    const status = shadow.querySelector('#status');
    const filters = shadow.querySelector('.filters');
    const box = shadow.querySelector('#box');
    const bar = shadow.querySelector('#bar');
    const minimize = shadow.querySelector('#minimize');
    const filterButtons = [...shadow.querySelectorAll('[data-filter]')];
    const setStatus = text => {
        status.textContent = '';
        String(text).split(/(\d+)/).forEach(part => {
            const node = document.createElement(/^\d+$/.test(part) ? 'strong' : 'span');
            node.textContent = part;
            if (/^\d+$/.test(part)) node.style.color = '#3d82ff';
            status.append(node);
        });
    };
    const filesForSelection = () => selectedFilter === 'all' ? scannedFiles : scannedFiles.filter(file => file.kind === selectedFilter);
    const counts = () => ({ all: scannedFiles.length, video: scannedFiles.filter(file => file.kind === 'video').length, image: scannedFiles.filter(file => file.kind === 'image').length, other: scannedFiles.filter(file => file.kind === 'other').length });
    const setResultsVisible = visible => {
        box.classList.toggle('results', visible);
        filters.classList.toggle('hidden', !visible);
        start.classList.toggle('hidden', !visible);
        if (!visible) stop.classList.add('hidden');
    };
    const updateSelection = () => {
        const count = counts();
        filterButtons.forEach(button => {
            const filter = button.dataset.filter;
            const label = filter === 'all' ? 'All' : filter === 'video' ? 'Videos' : filter === 'image' ? 'Images' : 'Other';
            button.textContent = `${label} (${count[filter]})`;
            button.classList.toggle('selected', filter === selectedFilter);
            button.classList.toggle('hidden', count[filter] === 0);
            button.disabled = running || count[filter] === 0;
        });
        start.disabled = running || filesForSelection().length === 0;
    };
    const setControls = active => {
        running = active;
        scan.disabled = active;
        stop.disabled = !active;
        stop.classList.toggle('hidden', activity !== 'download');
        updateSelection();
    };

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
            const match = String(value).match(/[^\n\\/]+\.[a-z0-9]+/i);
            if (match && (VIDEO_EXTENSIONS.test(match[0]) || IMAGE_EXTENSIONS.test(match[0]) || OTHER_FILE_EXTENSIONS.test(match[0]))) return match[0].trim();
        }
        return null;
    }

    function captureMedia(found) {
        for (const element of document.querySelectorAll('[data-id]')) {
            const name = nameFrom(element);
            const id = element.getAttribute('data-id');
            const kind = VIDEO_EXTENSIONS.test(name) ? 'video' : IMAGE_EXTENSIONS.test(name) ? 'image' : OTHER_FILE_EXTENSIONS.test(name) ? 'other' : null;
            if (!id || !name || !kind) continue;
            const resourceKey = element.getAttribute('data-resource-key') || element.getAttribute('data-resourcekey') || '';
            found.set(id, { id, name, resourceKey, kind });
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
            if (step && step % 10 === 0) setStatus(`Scanning Drive folder... ${found.size} files found`);
            const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5;
            stableAtBottom = atBottom ? (found.size === lastCount ? stableAtBottom + 1 : 0) : 0;
            if (stableAtBottom >= 4) break;
            lastCount = found.size;
        }
        container.scrollTop = originalTop;
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
        return [...found.values()];
    }

    scan.addEventListener('click', async () => {
        if (running) return;
        activity = 'scan'; stopRequested = false; setResultsVisible(false); setControls(true); setStatus('Scanning this Drive folder...');
        scannedFiles = await scanFolder();
        activity = null; selectedFilter = 'all'; setControls(false);
        if (stopRequested) { setStatus('Scan stopped. Click Scan folder to try again.'); return; }
        if (!scannedFiles.length) { setStatus('No supported files found. Wait for the folder to finish loading, then scan again.'); return; }
        setResultsVisible(true);
        updateSelection();
        const count = counts();
        setStatus(`Scan complete: ${count.video} videos, ${count.image} images, and ${count.other} other files found. Choose what to download.`);
    });

    filterButtons.forEach(button => button.addEventListener('click', () => {
        selectedFilter = button.dataset.filter;
        updateSelection();
        const count = filesForSelection().length;
        const label = selectedFilter === 'all' ? 'file' : selectedFilter === 'video' ? 'video' : selectedFilter === 'image' ? 'image' : 'other file';
        setStatus(`${count} ${label}${count === 1 ? '' : 's'} selected.`);
    }));

    start.addEventListener('click', async () => {
        if (running) return;
        const files = filesForSelection();
        if (!files.length) return;
        activity = 'download'; stopRequested = false; setControls(true);
        setStatus(`Starting ${files.length} selected download${files.length === 1 ? '' : 's'}...`);
        const response = await chrome.runtime.sendMessage({ action: 'START_DRIVE_VIDEO_QUEUE', files, folder: destinationFolder, concurrency: downloadConcurrency });
        if (!response?.ok) {
            activity = null;
            setControls(false);
            if (response?.error === 'license') {
                setStatus('Activate your RightMate license to download from Drive.');
                chrome.runtime.sendMessage({ action: 'OPEN_LICENSE' }).catch(() => {});
            } else {
                setStatus(response?.error || 'Could not start downloads.');
            }
        }
        else { destinationFolder = response.folder; downloadConcurrency = response.concurrency; }
    });
    stop.addEventListener('click', async () => {
        stopRequested = true;
        await chrome.runtime.sendMessage({ action: 'STOP_DRIVE_VIDEO_QUEUE' });
        if (activity === 'download') {
            activity = null;
            setControls(false);
            setStatus('Stopped. Downloads already started remain in Chrome.');
        } else if (activity === 'scan') {
            setStatus('Stopping scan...');
        }
    });
    chrome.runtime.onMessage.addListener(message => {
        if (message?.action !== 'DRIVE_QUEUE_STATUS') return;
        if (message.state === 'downloading') setStatus(`Starting ${message.started}/${message.total}: ${message.name} (${message.active} active)`);
        if (message.state === 'finished') { activity = null; setControls(false); setStatus(`Finished: ${message.done} completed${message.failed ? `, ${message.failed} failed` : ''}. Check Chrome Downloads.`); }
    });
})();
