// Floating download button for YouTube video pages.
//
// YouTube is a single-page app: it rewrites the URL via history.pushState instead of
// reloading, so this script runs once per tab and has to add/remove its own UI as the
// user navigates. Everything lives in a shadow root because YouTube's global CSS is
// aggressive enough to reshape plain injected markup.
//
// The button itself does no downloading — it sends DOWNLOAD_VIDEO to the service
// worker, which runs the same capture -> remux -> backend cascade the context menu
// uses, including its loading overlay and failure notifications.
(() => {
    'use strict';

    const HOST_ID = 'anypng-yt-fab';
    // Below the loading overlay in content.js (2147483647) so it never covers it.
    const Z_INDEX = '2147483000';

    // Mirrors VIDEO_QUALITY_OPTIONS in background.js — keep the ids in sync.
    const QUALITIES = [
        { id: 'best', label: 'Best Quality' },
        { id: '1080', label: '1080p' },
        { id: '720', label: '720p' },
        { id: '480', label: '480p' },
        { id: 'audio', label: 'Audio Only (MP3)' },
    ];

    let host = null;
    let shadow = null;
    let menuOpen = false;
    let enabled = true;
    let defaultQuality = 'best';
    let lastUrl = location.href;

    // --- page detection --------------------------------------------------

    // Only real video pages. The feed, search results, and channel pages have no
    // single video to download, and background.js would reject them anyway.
    function isVideoPage() {
        const { pathname, search } = location;
        if (pathname === '/watch') return new URLSearchParams(search).has('v');
        if (pathname.startsWith('/shorts/')) return pathname.length > 8;
        return false;
    }

    // --- UI --------------------------------------------------------------

    const STYLES = `
        :host { all: initial; }
        .wrap {
            position: fixed;
            right: 24px;
            bottom: 96px;
            z-index: ${Z_INDEX};
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        }
        .fab {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            border: none;
            background: #10b981;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
            transition: transform 0.15s ease, background 0.15s ease;
            padding: 0;
        }
        .fab:hover { background: #0ea472; transform: scale(1.06); }
        .fab:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
        .fab svg { width: 24px; height: 24px; display: block; }

        .menu {
            background: #1f2937;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            padding: 6px;
            min-width: 190px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .menu[hidden] { display: none; }
        .title {
            color: #9ca3af;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            padding: 8px 10px 6px;
        }
        .item {
            appearance: none;
            border: none;
            background: transparent;
            color: #f3f4f6;
            font-size: 14px;
            text-align: left;
            padding: 9px 10px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            width: 100%;
        }
        .item:hover { background: rgba(16, 185, 129, 0.18); }
        .item:focus-visible { outline: 2px solid #10b981; outline-offset: -2px; }
        .badge { color: #10b981; font-size: 11px; font-weight: 700; }

        @media (prefers-reduced-motion: reduce) {
            .fab { transition: none; }
        }
    `;

    const DOWNLOAD_ICON = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3v12"></path>
            <path d="m7 12 5 5 5-5"></path>
            <path d="M4 20h16"></path>
        </svg>
    `;

    function build() {
        // isConnected, not just a null check: if YouTube's own DOM churn ever removes
        // the node, the stale reference would otherwise make this a no-op forever and
        // the button would silently never come back.
        if (host && host.isConnected) return;
        host = null;
        shadow = null;
        menuOpen = false;

        host = document.createElement('div');
        host.id = HOST_ID;
        shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = STYLES;

        const wrap = document.createElement('div');
        wrap.className = 'wrap';

        const menu = document.createElement('div');
        menu.className = 'menu';
        menu.hidden = true;
        menu.setAttribute('role', 'menu');

        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = 'Download video';
        menu.appendChild(title);

        QUALITIES.forEach(({ id, label }) => {
            const item = document.createElement('button');
            item.className = 'item';
            item.type = 'button';
            item.dataset.quality = id;
            item.setAttribute('role', 'menuitem');

            const text = document.createElement('span');
            text.textContent = label;
            item.appendChild(text);

            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.dataset.badgeFor = id;
            item.appendChild(badge);

            item.addEventListener('click', () => startDownload(id));
            menu.appendChild(item);
        });

        const fab = document.createElement('button');
        fab.className = 'fab';
        fab.type = 'button';
        fab.title = 'Download this video with AnyPNG';
        fab.setAttribute('aria-label', 'Download this video with AnyPNG');
        fab.setAttribute('aria-haspopup', 'menu');
        fab.setAttribute('aria-expanded', 'false');
        fab.innerHTML = DOWNLOAD_ICON;
        fab.addEventListener('click', () => setMenu(!menuOpen));

        wrap.append(menu, fab);
        shadow.append(style, wrap);
        document.documentElement.appendChild(host);

        markDefaultQuality();
    }

    function destroy() {
        if (!host) return;
        host.remove();
        host = null;
        shadow = null;
        menuOpen = false;
    }

    function setMenu(open) {
        if (!shadow) return;
        menuOpen = open;
        shadow.querySelector('.menu').hidden = !open;
        shadow.querySelector('.fab').setAttribute('aria-expanded', String(open));
        if (open) markDefaultQuality();
    }

    // Shows which option the extension will use elsewhere (context menu, popup), so
    // the two entry points don't look like they disagree.
    function markDefaultQuality() {
        if (!shadow) return;
        shadow.querySelectorAll('[data-badge-for]').forEach((el) => {
            el.textContent = el.dataset.badgeFor === defaultQuality ? 'DEFAULT' : '';
        });
    }

    function startDownload(quality) {
        setMenu(false);
        // location.href rather than letting the worker read tab.url: right after an
        // SPA navigation the tab's recorded URL can still be the previous video, and
        // downloading the wrong one is worse than losing the client-side fast path.
        chrome.runtime.sendMessage({
            action: 'DOWNLOAD_VIDEO',
            quality,
            url: location.href,
        }).catch(() => { /* worker asleep or extension reloading */ });
    }

    // --- lifecycle -------------------------------------------------------

    function sync() {
        // Fullscreen puts the player above everything; a floating button there is
        // just an obstruction.
        const shouldShow = enabled && isVideoPage() && !document.fullscreenElement;
        if (shouldShow) build();
        else destroy();
    }

    document.addEventListener('click', (e) => {
        // Clicks inside the shadow root are retargeted to the host, so anything that
        // isn't the host is genuinely outside the widget.
        if (menuOpen && e.target !== host) setMenu(false);
    }, true);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) setMenu(false);
    });

    document.addEventListener('fullscreenchange', sync);

    // YouTube's own navigation event, plus a poll: the event has changed names over
    // the years, and the poll costs nothing next to what the page is already doing.
    window.addEventListener('yt-navigate-finish', sync);
    // Also re-syncs unconditionally, which re-attaches the button if anything
    // detached it. sync() is a couple of cheap checks when nothing has changed.
    setInterval(() => {
        lastUrl = location.href;
        sync();
    }, 1000);

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        if (changes.showYoutubeButton) {
            enabled = changes.showYoutubeButton.newValue !== false;
            sync();
        }
        if (changes.defaultVideoQuality) {
            defaultQuality = changes.defaultVideoQuality.newValue || 'best';
            markDefaultQuality();
        }
    });

    chrome.storage.sync.get(['showYoutubeButton', 'defaultVideoQuality'], (result) => {
        enabled = result.showYoutubeButton !== false; // absent = on
        defaultQuality = result.defaultVideoQuality || 'best';
        sync();
    });
})();
