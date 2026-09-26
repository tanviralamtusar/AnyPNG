document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();
});

async function loadTheme() {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

document.getElementById('login-btn').onclick = async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    const loginBtn = document.getElementById('login-btn');
    const originalBtnHTML = loginBtn.innerHTML;
    
    if (!email || !password) {
        errorMsg.innerText = "Please enter email and password";
        return;
    }
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span>⏳</span> Loading...';
    errorMsg.innerText = "";
    
    try {
        const bodyData = { email, password, grant_type: 'password' };
        
        const res = await rmAuthApi('auth/token?grant_type=password', bodyData);
        
        const data = await res.json();
        
        if (!res.ok) {
            let errorMessage = data.error_description || data.msg || data.error || data.message || `Error: ${res.status}`;
            
            if (data.code) {
                switch (data.code) {
                    case 'invalid_credentials':
                        errorMessage = "Invalid email or password";
                        break;
                    case 'email_not_confirmed':
                        // Best effort: the old code may still be valid if this is rate-limited.
                        await rmAuthApi('auth/resend', { type: 'signup', email }).catch(() => {});
                        window.location.href = `signup.html?verify=${encodeURIComponent(email)}`;
                        return;
                }
            }
            throw new Error(errorMessage);
        }
        
        let accessToken = data.access_token || (data.session && data.session.access_token);
        
        if (!accessToken) {
            throw new Error("No access token received from server");
        }
        
        await chrome.storage.local.set({ supabaseSession: data });
        // popup.html routes on to the dashboard or the license page.
        window.location.href = "popup.html";
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            errorMsg.innerText = "Network error. Please check your connection.";
        } else {
            errorMsg.innerText = err.message || "Login failed.";
        }
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalBtnHTML;
    }
};
