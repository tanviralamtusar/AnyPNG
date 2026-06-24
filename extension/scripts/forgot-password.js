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

document.getElementById('reset-btn').onclick = async () => {
    const email = document.getElementById('email').value.trim();
    const errorMsg = document.getElementById('error-msg');
    const successMsg = document.getElementById('success-msg');
    const resetBtn = document.getElementById('reset-btn');
    const originalBtnHTML = resetBtn.innerHTML;

    errorMsg.innerText = "";
    successMsg.innerText = "";

    if (!email) {
        errorMsg.innerText = "Please enter your email address";
        return;
    }

    resetBtn.disabled = true;
    resetBtn.innerHTML = '<span>⏳</span> Sending...';

    try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'x-client-info': 'anypng-extension'
            },
            body: JSON.stringify({ email })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            const errorMessage = data.error_description || data.msg || data.error || data.message || `Error: ${res.status}`;
            throw new Error(errorMessage);
        }

        // Supabase returns 200 regardless of whether the email exists (to avoid user enumeration)
        successMsg.innerText = "If an account exists for that email, a reset link is on its way.";
        resetBtn.innerHTML = '<span>Email Sent ✓</span>';
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            errorMsg.innerText = "Network error. Please check your connection.";
        } else {
            errorMsg.innerText = err.message || "Failed to send reset email.";
        }
        resetBtn.disabled = false;
        resetBtn.innerHTML = originalBtnHTML;
    }
};
