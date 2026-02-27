const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

let isLoginMode = true;

document.addEventListener('DOMContentLoaded', async () => {
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (supabaseSession) {
        showDashboard(supabaseSession);
    } else {
        document.getElementById('auth-view').classList.remove('hidden');
    }
});

document.getElementById('settings-btn').onclick = () => {
    chrome.runtime.openOptionsPage();
};

document.getElementById('toggle-signup').onclick = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('login-text').innerText = isLoginMode ? 'Login' : 'Create Account';
    document.getElementById('toggle-signup').innerText = isLoginMode ? 'Need an account? Sign Up' : 'Have an account? Login';
};

document.getElementById('login-btn').onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const endpoint = isLoginMode ? 'token?grant_type=password' : 'signup';
    
    try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error_description || data.msg);
        
        await chrome.storage.local.set({ supabaseSession: data });
        showDashboard(data);
    } catch (err) {
        document.getElementById('error-msg').innerText = err.message;
    }
};

document.getElementById('logout-btn').onclick = async () => {
    await chrome.storage.local.remove('supabaseSession');
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('auth-view').classList.remove('hidden');
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
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.getElementById('error-msg').innerText = "";
    
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
        // Fetch credits from profiles table
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${session.user.id}&select=credits`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${session.access_token}` }
        });

        if (!res.ok) {
            if (res.status === 401) {
                await chrome.storage.local.remove('supabaseSession');
                document.getElementById('dashboard-view').classList.add('hidden');
                document.getElementById('auth-view').classList.remove('hidden');
                document.getElementById('error-msg').innerText = "Session expired. Please login again.";
                return;
            }
            const errData = await res.json();
            throw new Error(errData.message || res.statusText);
        }

        const data = await res.json();
        if (data && data.length > 0) {
            document.getElementById('credit-count').innerText = data[0].credits;
        } else {
            document.getElementById('credit-count').innerText = "0";
            console.warn("No profile found for user", session.user.id);
        }
    } catch (err) {
        document.getElementById('credit-count').innerText = "Err";
        document.getElementById('error-msg').innerText = "Failed to load credits: " + err.message;
        console.error(err);
    }
}

// Popup Watermark Handlers
document.getElementById('popup-retry').onclick = async () => {
    const prompt = document.getElementById('popup-prompt').value;
    document.getElementById('popup-result-img').style.display = "none";
    document.getElementById('processing-container').classList.remove('hidden');
    document.getElementById('popup-retry').disabled = true;
    document.getElementById('popup-download').disabled = true;
    
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
        document.getElementById('popup-retry').disabled = false;
    } else if (message.action === "PROCESSING_WATERMARK") {
        document.getElementById('popup-placeholder').classList.add('hidden');
        document.getElementById('popup-result-img').style.display = "none";
        document.getElementById('processing-container').classList.remove('hidden');
        document.getElementById('popup-retry').disabled = true;
        document.getElementById('popup-download').disabled = true;
    }
});
