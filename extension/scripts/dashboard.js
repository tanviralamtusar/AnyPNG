const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

let isLoginMode = true;

async function refreshSessionIfNeeded() {
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession) return null;
    
    if (supabaseSession.refresh_token) {
        try {
            const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'apikey': SUPABASE_ANON_KEY,
                    'x-client-info': 'anypng-extension'
                },
                body: JSON.stringify({ refresh_token: supabaseSession.refresh_token })
            });
            
            if (res.ok) {
                const newSession = await res.json();
                const updatedSession = { ...supabaseSession, ...newSession };
                await chrome.storage.local.set({ supabaseSession: updatedSession });
                return updatedSession;
            } else {
                console.log('Session refresh failed with status:', res.status);
                const data = await res.json();
                console.log('Refresh error:', data);
                await chrome.storage.local.remove('supabaseSession');
                return null;
            }
        } catch (e) {
            console.log('Session refresh failed:', e);
            await chrome.storage.local.remove('supabaseSession');
            return null;
        }
    }
    return supabaseSession;
}

document.addEventListener('DOMContentLoaded', async () => {
    const session = await refreshSessionIfNeeded();
    if (session) {
        showDashboard(session);
    } else {
        window.location.replace('login.html');
    }
    loadTheme();
});

document.getElementById('settings-btn').onclick = () => {
    chrome.runtime.openOptionsPage();
};



// --- Navigation Logics ---
document.getElementById('nav-home-btn').onclick = async () => {
    // Already on dashboard, maybe just reload or ensure state
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession) {
        window.location.replace('login.html');
    }
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

document.getElementById('buy-btn').onclick = () => {
    window.open("https://your-payment-link-like-stripe.com", "_blank"); // Put your payment link here later
};

document.getElementById('refresh-credits-btn').onclick = async () => {
    const btn = document.getElementById('refresh-credits-btn');
    btn.classList.add('spinning');
    
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (supabaseSession) {
        document.getElementById('credit-count').style.opacity = "0.5";
        await showDashboard(supabaseSession);
        document.getElementById('credit-count').style.opacity = "1";
    }
    btn.classList.remove('spinning');
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
    
    // Check settings for advanced prompt
    chrome.storage.sync.get(['enableAdvancedPrompt'], (result) => {
        if (result.enableAdvancedPrompt) {
            document.getElementById('advanced-prompt-container').classList.remove('hidden');
        } else {
            document.getElementById('advanced-prompt-container').classList.add('hidden');
        }
    });

    // Check if there's a result image in storage
    chrome.storage.local.get(['lastWatermarkResult', 'watermarkProcessing'], (data) => {
        if (data.watermarkProcessing) {
            document.getElementById('popup-placeholder').classList.add('hidden');
            document.getElementById('popup-result-img').style.display = "none";
            document.getElementById('processing-container').classList.remove('hidden');
            document.getElementById('popup-retry').disabled = true;
            document.getElementById('popup-download').disabled = true;
        } else if (data.lastWatermarkResult) {
            document.getElementById('popup-placeholder').classList.add('hidden');
            document.getElementById('popup-result-img').src = data.lastWatermarkResult;
            document.getElementById('popup-result-img').style.display = "block";
            document.getElementById('popup-spinner').classList.add('hidden');
            document.getElementById('popup-retry').disabled = false;
            document.getElementById('popup-download').disabled = false;
        }
    });

    try {
        // Fetch credits from profiles table using normalized session
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=credits`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${accessToken}` }
        });

        if (!res.ok) {
            if (res.status === 401) {
                await chrome.storage.local.remove('supabaseSession');
                window.location.replace('login.html');
                document.getElementById('error-msg').innerText = "Session expired. Please login again.";
                return;
            }
            const errData = await res.json();
            throw new Error(errData.message || res.statusText);
        }

        const data = await res.json();
        const MAX_CREDITS = 100;
        if (data && data.length > 0) {
            const credits = data[0].credits || 0;
            const usedCredits = Math.max(0, MAX_CREDITS - credits);
            document.getElementById('credit-count').innerText = credits;
            document.getElementById('profile-credits-used').innerText = usedCredits;
            document.getElementById('profile-credits-total').innerText = `/ ${MAX_CREDITS}`;
            document.getElementById('profile-progress').style.width = `${(usedCredits / MAX_CREDITS) * 100}%`;
        } else {
            document.getElementById('credit-count').innerText = "0";
            document.getElementById('profile-credits-used').innerText = "0";
            document.getElementById('profile-progress').style.width = "0%";
            console.warn("No profile found for user", userId);
        }
    } catch (err) {
        document.getElementById('credit-count').innerText = "Err";
        document.getElementById('error-msg').innerText = "Failed to load credits: " + err.message;
        console.error(err);
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

async function loadTheme() {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Load theme on init
loadTheme();

// Popup Watermark Handlers
document.getElementById('popup-retry').onclick = async () => {
    const prompt = document.getElementById('popup-prompt').value;
    
    // Clear error message
    document.getElementById('error-msg').innerText = "";
    
    // Reset UI to processing state
    document.getElementById('popup-result-img').style.display = "none";
    document.getElementById('processing-container').classList.remove('hidden');
    document.querySelector('.progress-percentage').innerText = "0%";
    document.querySelector('.progress-ring-fill').style.strokeDashoffset = "339.292";
    document.querySelector('.processing-status-text').innerText = "Starting...";
    document.getElementById('popup-retry').disabled = true;
    document.getElementById('popup-download').disabled = true;
    document.getElementById('popup-placeholder').classList.add('hidden');
    
    await chrome.storage.local.set({ watermarkProcessing: true });
    chrome.runtime.sendMessage({ action: "RETRY_WATERMARK", prompt: prompt });
};

document.getElementById('popup-download').onclick = () => {
    const imgUrl = document.getElementById('popup-result-img').src;
    chrome.downloads.download({ url: imgUrl, filename: `AnyPNG_Cleaned_${Date.now()}.png` });
};

document.getElementById('popup-cancel').onclick = async () => {
    await chrome.storage.local.remove(['watermarkProcessing', 'lastOriginalImage']);
    document.getElementById('processing-container').classList.add('hidden');
    document.getElementById('popup-placeholder').classList.remove('hidden');
    document.getElementById('popup-retry').disabled = true;
    document.getElementById('popup-download').disabled = true;
    chrome.runtime.sendMessage({ action: "CANCEL_WATERMARK" });
};

// Listen for updates from background
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "UPDATE_PREVIEW") {
        document.getElementById('processing-container').classList.add('hidden');
        document.getElementById('popup-result-img').src = message.image;
        document.getElementById('popup-result-img').style.display = "block";
        document.getElementById('popup-retry').disabled = false;
        document.getElementById('popup-download').disabled = false;
        document.getElementById('popup-placeholder').classList.add('hidden');
    } else if (message.action === "SHOW_ERROR") {
        document.getElementById('processing-container').classList.add('hidden');
        document.getElementById('popup-result-img').style.display = "none";
        document.getElementById('popup-placeholder').classList.remove('hidden');
        document.getElementById('popup-retry').disabled = false;
        document.getElementById('popup-download').disabled = true;
        
        const errorText = message.error || "An error occurred";
        document.getElementById('error-msg').innerText = errorText;
        
        // Also show notification if popup is not visible
        chrome.notifications.create({ 
            type: 'basic', 
            iconUrl: 'icons/icon48.png', 
            title: 'AnyPNG Error', 
            message: errorText 
        });
    } else if (message.action === "PROCESSING_WATERMARK") {
        document.getElementById('popup-placeholder').classList.add('hidden');
        document.getElementById('popup-result-img').style.display = "none";
        document.getElementById('processing-container').classList.remove('hidden');
        document.querySelector('.progress-percentage').innerText = "0%";
        document.querySelector('.progress-ring-fill').style.strokeDashoffset = "339.292";
        document.querySelector('.processing-status-text').innerText = "Starting...";
        document.getElementById('popup-retry').disabled = true;
        document.getElementById('popup-download').disabled = true;
    }
});
