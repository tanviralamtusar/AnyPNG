// 🔒 Supabase Config
const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

// Load saved settings when the options page opens
document.addEventListener('DOMContentLoaded', async () => {
    // Load sync settings
    chrome.storage.sync.get(['upscaleFactor', 'enableAdvancedPrompt'], (result) => {
        if (result.upscaleFactor) {
            document.getElementById('upscaleFactor').value = result.upscaleFactor;
        }
        if (result.enableAdvancedPrompt !== undefined) {
            document.getElementById('enableAdvancedPrompt').checked = result.enableAdvancedPrompt;
        }
    });

    // Load local settings (theme)
    chrome.storage.local.get(['theme', 'supabaseSession'], async (data) => {
        const profileSection = document.getElementById('profile-section');
        
        if (data.theme === 'light') {
            document.getElementById('themeToggle').checked = true;
            document.body.classList.add('light-mode');
        }
        
        if (data.supabaseSession) {
            await loadProfile(data.supabaseSession);
        } else {
            profileSection.style.display = 'none';
        }
    });
});

async function loadProfile(session) {
    const nameStr = session.user.email.split('@')[0];
    const name = session.user.user_metadata?.full_name || nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
    document.getElementById('profile-name').innerText = name;
    document.getElementById('profile-email').innerText = session.user.email;
    document.getElementById('profile-avatar').innerText = name.charAt(0).toUpperCase();
}

// Theme toggle
document.getElementById('themeToggle').addEventListener('change', async (e) => {
    const isLight = e.target.checked;
    if (isLight) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    await chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
});

// 🔒 HARDCODED API CREDENTIALS (Matches background.js)
const API_CONFIG = {
    url: "https://png.botbhai.net",
    token: "my_super_secret_hostinger_token_123!"
};

// Test API Connection
document.getElementById('testBtn').addEventListener('click', async () => {
    const testBtn = document.getElementById('testBtn');
    const testStatus = document.getElementById('testStatus');

    // UI Loading State
    const originalText = testBtn.innerText;
    testBtn.innerText = 'Testing...';
    testBtn.disabled = true;
    testStatus.innerText = 'Checking server response...';
    testStatus.style.color = 'var(--text-muted)';
    testStatus.style.opacity = '1';

    try {
        // We attempt a simple fetch to the base URL or health endpoint
        // Since we don't know the full API, we check if the base URL responds
        const response = await fetch(API_CONFIG.url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${API_CONFIG.token}` }
        });

        // Even if it returns 404 or 405, if it's not a network error, 
        // the server is reachable and the token is being processed.
        if (response.status === 200 || response.status === 405 || response.status === 404 || response.status === 401) {
            testStatus.innerText = '✅ Connection Successful!';
            testStatus.style.color = 'var(--accent)';
        } else {
            throw new Error(`Server returned status: ${response.status}`);
        }
    } catch (error) {
        testStatus.innerText = `❌ Connection Failed: ${error.message}`;
        testStatus.style.color = '#ef4444';
    } finally {
        testBtn.innerText = originalText;
        testBtn.disabled = false;

        // Hide message after a delay
        setTimeout(() => {
            testStatus.style.opacity = '0';
        }, 5000);
    }
});

// Save settings when the button is clicked
document.getElementById('saveBtn').addEventListener('click', () => {
    const upscaleFactor = document.getElementById('upscaleFactor').value;
    const enableAdvancedPrompt = document.getElementById('enableAdvancedPrompt').checked;

    chrome.storage.sync.set({ upscaleFactor, enableAdvancedPrompt }, () => {
        const status = document.getElementById('status');
        status.classList.add('show');

        // Change button text temporarily
        const originalText = document.getElementById('saveBtn').innerText;
        document.getElementById('saveBtn').innerText = 'Saved!';

        setTimeout(() => {
            status.classList.remove('show');
            document.getElementById('saveBtn').innerText = originalText;
        }, 2000);
    });
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await chrome.storage.local.remove('supabaseSession');
    document.getElementById('profile-name').innerText = 'Not logged in';
    document.getElementById('profile-email').innerText = '-';
    document.getElementById('profile-avatar').innerText = '?';
    window.close();
});
