// Shared licensing helper. Loaded by the service worker via importScripts() and
// by the extension's pages with a plain <script> tag, so everything here must
// work without modules and without a DOM.
//
// The backend owns every licensing decision. This file only: remembers a random
// per-install device id, caches the signed entitlement token the backend issues,
// and attaches that token to protected requests. Nothing here is a security
// boundary — a determined user can edit extension storage — but it is what makes
// "one account, one active device" hold for normal use.

const RIGHTMATE_API_URL = "https://anypng.botbhai.net";
const RM_SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const RM_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

const RM_DEVICE_KEY = 'rmDeviceId';
const RM_LICENSE_KEY = 'rmLicense';

// Re-check with the server this often even while the cached token is still
// valid, so a key moved to another device stops working reasonably quickly.
const RM_RECHECK_MS = 6 * 60 * 60 * 1000;
// Refresh early rather than letting a request fail on a just-expired token.
const RM_RENEW_MARGIN_MS = 60 * 60 * 1000;

// Reasons the backend and this file agree on, mapped to what the user sees.
const RM_LICENSE_MESSAGES = {
    no_session: 'Sign in to use RightMate.',
    no_license: 'Enter your license key to use RightMate.',
    no_device: 'Activate your license key on this device.',
    other_device: 'Your license is active on another device.',
    cooldown: 'This key was moved to another device recently.',
    offline: 'RightMate could not verify your license. Check your connection.',
    invalid_token: 'Your license could not be verified.',
    expired_token: 'Your license needs to be re-checked.',
};

function rmLicenseMessage(reason, fallback) {
    return RM_LICENSE_MESSAGES[reason] || fallback || 'RightMate needs an active license.';
}

// --- device identity --------------------------------------------------------

// Deliberately chrome.storage.local, never .sync: a synced id would follow the
// Chrome profile onto every machine and make the device binding meaningless.
async function rmGetDeviceId() {
    const stored = await chrome.storage.local.get(RM_DEVICE_KEY);
    if (stored[RM_DEVICE_KEY]) return stored[RM_DEVICE_KEY];
    const deviceId = crypto.randomUUID();
    await chrome.storage.local.set({ [RM_DEVICE_KEY]: deviceId });
    return deviceId;
}

function rmDeviceLabel() {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    const os = /Windows/.test(ua) ? 'Windows'
        : /Mac OS X|Macintosh/.test(ua) ? 'macOS'
        : /CrOS/.test(ua) ? 'ChromeOS'
        : /Android/.test(ua) ? 'Android'
        : /Linux/.test(ua) ? 'Linux'
        : 'Unknown OS';
    const browser = ua.match(/\b(Edg|OPR|Chrome)\/(\d+)/);
    const name = browser ? ({ Edg: 'Edge', OPR: 'Opera' }[browser[1]] || 'Chrome') : 'Browser';
    return browser ? `${os} - ${name} ${browser[2]}` : os;
}

// --- session ----------------------------------------------------------------

function rmAccessToken(session) {
    if (!session) return null;
    return session.access_token || session.session?.access_token || null;
}

// Returns a session with a fresh access token, or null if the user must sign in.
async function rmGetSession() {
    let { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession?.refresh_token) return supabaseSession || null;
    try {
        const res = await fetch(`${RM_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': RM_SUPABASE_ANON_KEY,
                'x-client-info': 'anypng-extension'
            },
            body: JSON.stringify({ refresh_token: supabaseSession.refresh_token })
        });
        if (!res.ok) {
            await chrome.storage.local.remove('supabaseSession');
            return null;
        }
        supabaseSession = { ...supabaseSession, ...(await res.json()) };
        await chrome.storage.local.set({ supabaseSession });
        return supabaseSession;
    } catch (error) {
        // A network blip should not sign the user out; keep the stored session
        // and let the license check fall back to its cached entitlement.
        console.warn('[RightMate] Session refresh failed', error);
        return supabaseSession;
    }
}

// --- license state ----------------------------------------------------------

async function rmCachedLicense() {
    const stored = await chrome.storage.local.get(RM_LICENSE_KEY);
    return stored[RM_LICENSE_KEY] || null;
}

async function rmStoreLicense(state) {
    const next = { ...state, checkedAt: Date.now() };
    await chrome.storage.local.set({ [RM_LICENSE_KEY]: next });
    return next;
}

async function rmClearLicense() {
    await chrome.storage.local.remove(RM_LICENSE_KEY);
}

function rmTokenUsable(state) {
    return !!(state?.licensed && state.token && state.exp > Date.now());
}

function rmStateFromResponse(data) {
    return {
        licensed: !!data.licensed,
        reason: data.licensed ? null : (data.reason || 'no_license'),
        license: data.license || null,
        purchaseUrl: data.purchase_url || null,
        token: data.entitlement_token || null,
        exp: data.entitlement_token ? Date.now() + ((data.expires_in || 0) * 1000) : 0,
    };
}

async function rmLicenseApi(path, accessToken, body) {
    const response = await fetch(`${RIGHTMATE_API_URL}${path}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    let data = null;
    try { data = await response.json(); } catch { /* empty body */ }
    return { ok: response.ok, status: response.status, data };
}

// Detail payloads are `{error:'license', reason, message}` for licensing
// failures and a plain string for everything else.
function rmErrorFromResponse(result, fallback) {
    const detail = result?.data?.detail;
    if (typeof detail === 'string') return { reason: 'error', message: detail, retryAfter: 0 };
    if (detail?.message) {
        return { reason: detail.reason || 'error', message: detail.message, retryAfter: detail.retry_after || 0 };
    }
    return { reason: 'error', message: fallback, retryAfter: 0 };
}

/**
 * Current license state, refreshing from the server when the cache is stale.
 * Never throws: a failed check downgrades to the cached entitlement if one is
 * still valid, which is what lets the extension work offline for a while.
 */
async function rmGetLicenseState({ force = false } = {}) {
    const cached = await rmCachedLicense();
    const fresh = cached && (Date.now() - (cached.checkedAt || 0)) < RM_RECHECK_MS;
    const tokenHealthy = rmTokenUsable(cached) && cached.exp - Date.now() > RM_RENEW_MARGIN_MS;
    if (!force && fresh && tokenHealthy) return cached;

    const session = await rmGetSession();
    const accessToken = rmAccessToken(session);
    if (!accessToken) {
        await rmClearLicense();
        return { licensed: false, reason: 'no_session' };
    }

    try {
        const result = await rmLicenseApi('/license/status', accessToken, { device_id: await rmGetDeviceId() });
        if (result.status === 401) {
            await rmClearLicense();
            return { licensed: false, reason: 'no_session' };
        }
        if (!result.ok || !result.data) throw new Error(rmErrorFromResponse(result, 'License check failed.').message);
        return await rmStoreLicense(rmStateFromResponse(result.data));
    } catch (error) {
        console.warn('[RightMate] License check failed', error);
        if (rmTokenUsable(cached)) return cached;   // offline grace period
        return { licensed: false, reason: 'offline', license: cached?.license || null };
    }
}

/** True when this device may use the extension. */
async function rmIsLicensed(options) {
    const state = await rmGetLicenseState(options);
    return !!state.licensed;
}

/** Headers for a protected backend call, or null when this device is not licensed. */
async function rmAuthHeaders() {
    const state = await rmGetLicenseState();
    if (!rmTokenUsable(state)) return null;
    const accessToken = rmAccessToken(await rmGetSession());
    if (!accessToken) return null;
    return { 'Authorization': `Bearer ${accessToken}`, 'X-License': state.token };
}

async function rmActivateLicense(key) {
    const accessToken = rmAccessToken(await rmGetSession());
    if (!accessToken) return { ok: false, reason: 'no_session', message: rmLicenseMessage('no_session') };

    let result;
    try {
        result = await rmLicenseApi('/license/activate', accessToken, {
            key: String(key || '').trim(),
            device_id: await rmGetDeviceId(),
            device_label: rmDeviceLabel()
        });
    } catch {
        return { ok: false, reason: 'offline', message: rmLicenseMessage('offline') };
    }
    if (result.status === 401) return { ok: false, reason: 'no_session', message: rmLicenseMessage('no_session') };
    if (!result.ok || !result.data?.licensed) {
        const error = rmErrorFromResponse(result, 'That license key could not be activated.');
        return { ok: false, ...error };
    }
    const state = await rmStoreLicense(rmStateFromResponse(result.data));
    return { ok: true, state };
}

async function rmDeactivateLicense() {
    const accessToken = rmAccessToken(await rmGetSession());
    if (!accessToken) return { ok: false, reason: 'no_session', message: rmLicenseMessage('no_session') };

    let result;
    try {
        result = await rmLicenseApi('/license/deactivate', accessToken, { device_id: await rmGetDeviceId() });
    } catch {
        return { ok: false, reason: 'offline', message: rmLicenseMessage('offline') };
    }
    if (!result.ok) return { ok: false, ...rmErrorFromResponse(result, 'Could not deactivate this device.') };
    await rmClearLicense();
    return { ok: true };
}

function rmOpenLicensePage() {
    return chrome.tabs.create({ url: chrome.runtime.getURL('pages/license.html') });
}

// Formats keystrokes into RM-XXXX-XXXX-XXXX-XXXX as the user types or pastes.
function rmFormatKeyInput(value) {
    const cleaned = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^RM/, '');
    const groups = cleaned.slice(0, 16).match(/.{1,4}/g) || [];
    return groups.length ? ['RM', ...groups].join('-') : '';
}
