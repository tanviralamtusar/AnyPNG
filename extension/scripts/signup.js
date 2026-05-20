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

document.getElementById('signup-btn').onclick = async () => {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    const signupBtn = document.getElementById('signup-btn');
    const originalBtnHTML = signupBtn.innerHTML;
    
    if (!fullname || !email || !password) {
        errorMsg.innerText = "Please fill in all fields";
        return;
    }
    
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<span>⏳</span> Loading...';
    errorMsg.innerText = "";
    
    try {
        const bodyData = { 
            email, 
            password,
            data: { 
                full_name: fullname
            }
        };
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
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
                    case 'weak_password':
                        errorMessage = "Password is too weak. Use at least 6 characters.";
                        break;
                    case 'email_already_exists':
                        errorMessage = "An account with this email already exists";
                        break;
                }
            }
            throw new Error(errorMessage);
        }
        
        let accessToken = data.access_token || (data.session && data.session.access_token);
        
        if (!accessToken) {
            if (data.id || (data.user && data.user.id)) {
                errorMsg.innerText = "Account created! Please check your email to confirm.";
                errorMsg.style.color = "var(--success)";
                errorMsg.style.background = "rgba(16, 185, 129, 0.1)";
                signupBtn.disabled = false;
                signupBtn.innerHTML = originalBtnHTML;
                return;
            }
        }
        
        if (!accessToken) {
            throw new Error("No access token received from server");
        }
        
        await chrome.storage.local.set({ supabaseSession: data });
        // After successful signup with token, navigate to popup dashboard
        window.location.href = "popup.html"; 
    } catch (err) {
        errorMsg.style.color = "var(--error)";
        errorMsg.style.background = "rgba(239, 68, 68, 0.1)";
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            errorMsg.innerText = "Network error. Please check your connection.";
        } else {
            errorMsg.innerText = err.message || "Signup failed.";
        }
        signupBtn.disabled = false;
        signupBtn.innerHTML = originalBtnHTML;
    }
};
