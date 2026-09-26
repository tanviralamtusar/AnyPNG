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

// The only server the extension talks to. Sign-in, profile and rating calls go
// through its /auth/* and /me/* proxy, so no Supabase URL or key ships here.
const RIGHTMATE_API_URL = "https://rightmate-api.oddbirds.dev";

// Public half of the backend's LICENSE_SIGNING_KEY (raw Ed25519, base64url).
// Duplicated in offscreen.js on purpose; change both together.
const RM_LICENSE_PUBLIC_KEY = 'HYqoBe8rhoaZU9QFXO4TconHY9FPX_fkIuiMVxn_ITw';

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

/**
 * Calls the backend's auth/account proxy. `path` is e.g. 'auth/token?grant_type=password',
 * 'auth/signup' or 'me/rating'. /auth/* responses are Supabase's own, passed through.
 */
function rmAuthApi(path, body, { method = 'POST', accessToken } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    return fetch(`${RIGHTMATE_API_URL}/${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
    });
}

// Refresh this long before the access token expires. Refreshing on every call
// would burn Supabase's per-IP token rate limit for nothing.
const RM_SESSION_REFRESH_MARGIN_MS = 5 * 60 * 1000;

// Returns a session with a fresh access token, or null if the user must sign in.
async function rmGetSession({ forceRefresh = false } = {}) {
    let { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession?.refresh_token) return supabaseSession || null;
    const expiresAt = (supabaseSession.expires_at || 0) * 1000;
    if (!forceRefresh && expiresAt - Date.now() > RM_SESSION_REFRESH_MARGIN_MS) return supabaseSession;
    try {
        const res = await rmAuthApi('auth/token?grant_type=refresh_token', { refresh_token: supabaseSession.refresh_token });
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            // The refresh token was rejected: the user has to sign in again.
            await chrome.storage.local.remove('supabaseSession');
            return null;
        }
        if (!res.ok) throw new Error(`Session refresh failed (${res.status})`);
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

    let accessToken = rmAccessToken(await rmGetSession());
    if (!accessToken) {
        await rmClearLicense();
        return { licensed: false, reason: 'no_session' };
    }

    try {
        let result = await rmLicenseApi('/license/status', accessToken, { device_id: await rmGetDeviceId() });
        if (result.status === 401) {
            // The access token is reused until near expiry, so it may have been
            // revoked server-side (e.g. a password reset). Refresh once and retry.
            accessToken = rmAccessToken(await rmGetSession({ forceRefresh: true }));
            if (accessToken) result = await rmLicenseApi('/license/status', accessToken, { device_id: await rmGetDeviceId() });
        }
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
