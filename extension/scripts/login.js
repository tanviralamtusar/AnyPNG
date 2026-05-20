const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

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
        
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'apikey': SUPABASE_ANON_KEY,
                'x-client-info': 'anypng-extension'
            },
            body: JSON.stringify(bodyData)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            let errorMessage = data.error_description || data.msg || data.error || data.message || `Error: ${res.status}`;
            
            if (data.code) {
                switch (data.code) {
                    case 'invalid_grant':
                        errorMessage = "Invalid email or password";
                        break;
                }
            }
            throw new Error(errorMessage);
        }
        
        let accessToken = data.access_token || (data.session && data.session.access_token);
        
        if (!accessToken) {
            throw new Error("No access token received from server");
        }
        
        await chrome.storage.local.set({ supabaseSession: data });
        // After successful login, navigate back to popup dashboard logic
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
