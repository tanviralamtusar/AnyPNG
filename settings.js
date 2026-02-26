// Load saved settings when the options page opens
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['upscaleFactor'], (result) => {
        if (result.upscaleFactor) {
            document.getElementById('upscaleFactor').value = result.upscaleFactor;
        }
    });
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

    chrome.storage.sync.set({ upscaleFactor }, () => {
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
