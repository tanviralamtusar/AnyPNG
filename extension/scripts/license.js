// Shared licensing helper. Loaded by the service worker via importScripts() and
// by the extension's pages with a plain <script> tag, so everything here must
// work without modules and without a DOM.
//
// The backend owns every licensing decision. This file only: remembers a random
// per-install device id, caches the signed entitlement token the backend issues,
// verifies that token's Ed25519 signature before trusting it, and attaches it to
// protected requests. The signature check means a hand-edited license cache no
// longer unlocks the local tools; editing this code still can, which is why the
// offscreen document re-verifies the token on its own (see offscreen.js).

const RIGHTMATE_API_URL = "https://rightmate-api.oddbirds.dev";
const RM_SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const RM_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

// Public half of the backend's LICENSE_SIGNING_KEY (raw Ed25519, base64url).
// Duplicated in offscreen.js on purpose; change both together.
const RM_LICENSE_PUBLIC_KEY = '9VOPCgJcbADdcZPRXDIiSlu1gNkf667sk4DexsX3C6M';

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

function rmBase64UrlBytes(value) {
    const base64 = String(value).replace(/-/g, '+').replace(/_/g, '/');
    return Uint8Array.from(atob(base64 + '='.repeat((4 - base64.length % 4) % 4)), c => c.charCodeAt(0));
}

let rmPublicKeyPromise = null;

/**
 * The token's payload when its signature, scope, expiry and device binding all
 * check out, otherwise null. The payload's `dev` is a hash of the device id, so
 * a token copied from another install fails here without that install's id.
 */
async function rmVerifyEntitlement(token) {
    try {
        const [encoded, signature] = String(token || '').split('.');
        if (!encoded || !signature) return null;
        rmPublicKeyPromise ??= crypto.subtle.importKey(
            'raw', rmBase64UrlBytes(RM_LICENSE_PUBLIC_KEY), { name: 'Ed25519' }, false, ['verify']);
        const valid = await crypto.subtle.verify(
            { name: 'Ed25519' }, await rmPublicKeyPromise,
            rmBase64UrlBytes(signature), new TextEncoder().encode(encoded));
        if (!valid) return null;

        const payload = JSON.parse(new TextDecoder().decode(rmBase64UrlBytes(encoded)));
        if (payload.scope !== 'license' || !(payload.exp * 1000 > Date.now())) return null;
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(await rmGetDeviceId()));
        const deviceHash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
        return payload.dev === deviceHash ? payload : null;
    } catch (error) {
        console.warn('[RightMate] Entitlement check failed', error);
        return null;
    }
}

/** True when `state` claims a license and carries a genuine, unexpired token for this device. */
async function rmTokenUsable(state) {
    return !!(state?.licensed && await rmVerifyEntitlement(state.token));
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
    // Everything in the cache is user-editable; only the signed token is trusted.
    const payload = cached?.licensed ? await rmVerifyEntitlement(cached.token) : null;
    const fresh = cached && (Date.now() - (cached.checkedAt || 0)) < RM_RECHECK_MS;
    const tokenHealthy = payload && payload.exp * 1000 - Date.now() > RM_RENEW_MARGIN_MS;
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
        return await rmStoreLicense(await rmCheckedState(rmStateFromResponse(result.data)));
    } catch (error) {
        console.warn('[RightMate] License check failed', error);
        if (payload) return cached;   // offline grace period
        return { licensed: false, reason: 'offline', license: cached?.license || null };
    }
}

// A token the pinned public key rejects (e.g. the server's key was rotated
// without shipping the new public key) must not read as licensed.
async function rmCheckedState(state) {
    if (!state.licensed || await rmTokenUsable(state)) return state;
    return { ...state, licensed: false, reason: 'invalid_token', token: null, exp: 0 };
}

/** True when this device may use the extension. */
async function rmIsLicensed(options) {
    const state = await rmGetLicenseState(options);
    return !!state.licensed;
}

/** Headers for a protected backend call, or null when this device is not licensed. */
async function rmAuthHeaders() {
    const state = await rmGetLicenseState();
    if (!await rmTokenUsable(state)) return null;
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
    const state = await rmStoreLicense(await rmCheckedState(rmStateFromResponse(result.data)));
    if (!state.licensed) return { ok: false, reason: state.reason, message: rmLicenseMessage(state.reason) };
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
