let isLoginMode = true;

document.addEventListener('DOMContentLoaded', async () => {
    const session = await rmGetSession();
    if (session) {
        showDashboard(session);
        showLicense();
        showUpdateBanner();
    } else {
        window.location.replace('login.html');
    }
    loadTheme();
});

document.getElementById('settings-btn')?.addEventListener('click', () => chrome.runtime.openOptionsPage());



// --- Navigation Logics ---
document.getElementById('nav-home-btn').onclick = async () => {
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession) {
        window.location.replace('login.html');
        return;
    }
    document.getElementById('nav-home-btn').classList.add('active');
};

document.getElementById('nav-settings-btn').onclick = () => {
    document.getElementById('nav-home-btn').classList.remove('active');
    document.getElementById('nav-settings-btn').classList.add('active');
    document.getElementById('logout-btn')?.classList.remove('active');
    chrome.runtime.openOptionsPage();
};

document.getElementById('logout-btn').onclick = async () => {
    await chrome.storage.local.remove('supabaseSession');
    window.location.replace('login.html');
};

async function showDashboard(session) {
    document.getElementById('error-msg').innerText = "";
    
    // Normalize session object - handle different Supabase response formats
    // Response could be: { user, session } or { user, access_token } or { session: { user, access_token } }
    let userId = null;
    let accessToken = null;
    
    if (session.user && session.user.id) {
        // Format: { user: { id: ... }, access_token: ... }
        userId = session.user.id;
        accessToken = session.access_token || (session.session && session.session.access_token);
    } else if (session.session && session.session.user) {
        // Format: { session: { user: { id: ... }, access_token: ... } }
        userId = session.session.user.id;
        accessToken = session.session.access_token;
    } else if (session.id) {
        // Format: { id: ..., access_token: ... } (user is the session itself)
        userId = session.id;
        accessToken = session.access_token;
    }
    
    console.log('Session user ID:', userId);
    console.log('Session access token:', accessToken ? 'present' : 'missing');
    
    if (!userId || !accessToken) {
        console.error('Invalid session format:', session);
        document.getElementById('error-msg').innerText = "Session invalid. Please login again.";
        await chrome.storage.local.remove('supabaseSession');
        window.location.replace('login.html');
        return;
    }
    
    // Fill out Profile Basic info - handle different session formats
    const profileInfo = document.getElementById('profile-info');
    if (profileInfo) {
        profileInfo.classList.remove('hidden');
    }
    
    // Try to get user email from various possible locations
    let userEmail = '';
    let userMetadata = null;
    
    if (session.user && session.user.email) {
        userEmail = session.user.email;
        userMetadata = session.user.user_metadata;
    } else if (session.session && session.session.user && session.session.user.email) {
        userEmail = session.session.user.email;
        userMetadata = session.session.user.user_metadata;
    }
    
    const nameStr = userEmail ? userEmail.split('@')[0] : 'User';
    const displayName = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
    const fullName = userMetadata?.full_name || displayName;
    
    // Update any elements that exist
    const profileEmailEl = document.getElementById('profile-email');
    if (profileEmailEl) profileEmailEl.innerText = userEmail;
    
    const profileNameEl = document.getElementById('profile-name');
    if (profileNameEl) profileNameEl.innerText = fullName;
}

// Sideloaded installs cannot auto-update, so surface the version gap here and
// point at the download. Hidden entirely when the build is current.
async function showUpdateBanner() {
    const banner = document.getElementById('update-banner');
    if (!banner) return;

    const state = await rmCheckForUpdate().catch(() => null);
    const message = rmUpdateMessage(state);
    if (!message) {
        banner.classList.add('hidden');
        return;
    }

    banner.classList.remove('hidden');
    banner.classList.toggle('is-required', !!state.unsupported);
    document.getElementById('update-title').innerText = state.unsupported
        ? 'Update required'
        : 'Update available';
    document.getElementById('update-detail').innerText = state.notes
        ? `${message} ${state.notes}`
        : message;

    // Without a download URL there is nowhere to send them, so it stays a notice.
    if (state.downloadUrl) {
        banner.href = state.downloadUrl;
        banner.removeAttribute('aria-disabled');
    } else {
        banner.removeAttribute('href');
        banner.setAttribute('aria-disabled', 'true');
    }
}

// The license card doubles as the way into the activation page.
async function showLicense() {
    const card = document.getElementById('license-card');
    if (!card) return;
    card.onclick = () => { window.location.href = 'license.html'; };

    const state = await rmGetLicenseState();
    const summary = document.getElementById('license-summary');
    const device = document.getElementById('license-device');

    // The dot and tint stay neutral until the check resolves, so a slow network
    // never flashes red at someone whose license is fine.
    card.classList.toggle('is-ok', !!state.licensed);
    card.classList.toggle('is-bad', !state.licensed);

    if (state.licensed) {
        summary.innerText = 'License active on this device';
        device.innerText = state.license?.masked_key || '';
        return;
    }
    summary.innerText = rmLicenseMessage(state.reason);
    device.innerText = state.reason === 'other_device'
        ? `Currently on ${state.license?.device_label || 'another device'}`
        : 'Click to open license settings';
}

async function loadTheme() {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Load theme on init
loadTheme();
