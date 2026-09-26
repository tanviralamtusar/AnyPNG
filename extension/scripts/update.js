// Update notifier for sideloaded installs.
//
// Chrome only auto-updates extensions it has an update_url for, which a
// "Load unpacked" install never has. So the extension cannot update itself —
// it can only notice that it is behind and tell the user where the new build is.
//
// Loaded as a classic script: by the service worker via importScripts(), and by
// the pages with a <script> tag. It reads RIGHTMATE_API_URL from license.js, so
// license.js must load first.

const RM_UPDATE_KEY = 'rmUpdate';
const RM_UPDATE_ALARM = 'rm-update-check';
// Often enough that nobody runs a stale build for long, rare enough that it is
// one request per browser per quarter-day.
const RM_UPDATE_CHECK_MS = 6 * 60 * 60 * 1000;

function rmCurrentVersion() {
    try {
        return chrome.runtime.getManifest().version;
    } catch {
        return '0.0.0';
    }
}

/**
 * Compare dotted versions. Returns -1, 0 or 1.
 * Non-numeric parts count as 0, so a malformed value never reads as newer.
 */
function rmCompareVersions(a, b) {
    const parse = (value) => String(value || '').split('.').map((chunk) => {
        const digits = chunk.replace(/\D/g, '');
        return digits ? Number(digits) : 0;
    });
    const left = parse(a);
    const right = parse(b);
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const diff = (left[i] || 0) - (right[i] || 0);
        if (diff) return diff < 0 ? -1 : 1;
    }
    return 0;
}

function rmUpToDateState() {
    return { current: rmCurrentVersion(), outdated: false, unsupported: false, checkedAt: Date.now() };
}

async function rmCachedUpdate() {
    const stored = await chrome.storage.local.get(RM_UPDATE_KEY);
    return stored[RM_UPDATE_KEY] || null;
}

/**
 * Ask the backend what the current build is and cache the answer.
 * Never throws: a failed check just leaves the last known state in place, so a
 * flaky network never nags someone who is actually up to date.
 */
async function rmFetchUpdateState() {
    const current = rmCurrentVersion();
    let data = null;
    try {
        const response = await fetch(`${RIGHTMATE_API_URL}/extension/version`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        data = await response.json();
    } catch (error) {
        console.warn('[RightMate] Update check failed', error);
        const cached = await rmCachedUpdate();
        return cached || rmUpToDateState();
    }

    const latest = String(data?.latest || '');
    const minSupported = String(data?.min_supported || '');
    const state = {
        current,
        latest,
        downloadUrl: data?.download_url || '',
        notes: data?.notes || '',
        // An unset or unparseable `latest` must not read as "you are behind".
        outdated: !!latest && rmCompareVersions(current, latest) < 0,
        unsupported: !!minSupported && rmCompareVersions(current, minSupported) < 0,
        checkedAt: Date.now(),
    };
    await chrome.storage.local.set({ [RM_UPDATE_KEY]: state });
    return state;
}

/** Cached update state, refreshed when stale. Safe to call from any page. */
async function rmGetUpdateState({ force = false } = {}) {
    const cached = await rmCachedUpdate();
    // A cache written by an older build describes that build, not this one.
    const sameBuild = cached && cached.current === rmCurrentVersion();
    const fresh = sameBuild && (Date.now() - (cached.checkedAt || 0)) < RM_UPDATE_CHECK_MS;
    if (!force && fresh) return cached;
    return rmFetchUpdateState();
}

/** Toolbar badge: a quiet dot that something needs attention. */
async function rmApplyUpdateBadge(state) {
    if (!chrome.action?.setBadgeText) return;
    const needed = state?.outdated || state?.unsupported;
    try {
        await chrome.action.setBadgeText({ text: needed ? '!' : '' });
        if (needed) {
            await chrome.action.setBadgeBackgroundColor({
                color: state.unsupported ? '#f43f5e' : '#3b82f6',
            });
        }
    } catch (error) {
        console.warn('[RightMate] Could not set the update badge', error);
    }
}

async function rmCheckForUpdate({ force = false } = {}) {
    const state = await rmGetUpdateState({ force });
    await rmApplyUpdateBadge(state);
    return state;
}

/** One line describing the state, or null when there is nothing to say. */
function rmUpdateMessage(state) {
    if (state?.unsupported) {
        return `Update required — version ${state.latest || 'newer'} is needed to keep using RightMate.`;
    }
    if (state?.outdated) {
        return `Version ${state.latest} is available. You have ${state.current}.`;
    }
    return null;
}
