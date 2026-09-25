const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

// Matches the "Minimum interval per user" in Supabase's SMTP settings.
const RESEND_COOLDOWN_SECONDS = 60;

const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');
let pendingEmail = '';

document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();
});

async function loadTheme() {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

function authFetch(path, body, { method = 'POST', accessToken } = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'x-client-info': 'anypng-extension'
    };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    return fetch(`${SUPABASE_URL}/auth/v1/${path}`, { method, headers, body: JSON.stringify(body) });
}

function apiError(data, status) {
    return data.error_description || data.msg || data.error || data.message || `Error: ${status}`;
}

function showError(message) {
    successMsg.innerText = "";
    errorMsg.innerText = message;
}

function showSuccess(message) {
    errorMsg.innerText = "";
    successMsg.innerText = message;
}

function networkAware(err, fallback) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
        return "Network error. Please check your connection.";
    }
    return err.message || fallback;
}

// Supabase returns 200 regardless of whether the email exists (to avoid user enumeration)
async function sendRecoveryCode(email) {
    const res = await authFetch('recover', { email });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(apiError(data, res.status));
    }
}

function startResendCooldown() {
    const resendBtn = document.getElementById('resend-btn');
    let remaining = RESEND_COOLDOWN_SECONDS;
    resendBtn.disabled = true;
    resendBtn.innerText = `Resend in ${remaining}s`;
    const timer = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.innerText = "Resend code";
        } else {
            resendBtn.innerText = `Resend in ${remaining}s`;
        }
    }, 1000);
}

document.getElementById('reset-btn').onclick = async () => {
    const email = document.getElementById('email').value.trim();
    const resetBtn = document.getElementById('reset-btn');
    const originalBtnHTML = resetBtn.innerHTML;

    if (!email) {
        showError("Please enter your email address");
        return;
    }

    resetBtn.disabled = true;
    resetBtn.innerHTML = '<span>⏳</span> Sending...';
    showError("");

    try {
        await sendRecoveryCode(email);
        pendingEmail = email;
        document.getElementById('code-email').innerText = email;
        document.getElementById('email-step').classList.add('hidden');
        document.getElementById('code-step').classList.remove('hidden');
        document.getElementById('otp').focus();
        startResendCooldown();
    } catch (err) {
        showError(networkAware(err, "Failed to send reset email."));
    } finally {
        resetBtn.disabled = false;
        resetBtn.innerHTML = originalBtnHTML;
    }
};

document.getElementById('set-password-btn').onclick = async () => {
    const token = document.getElementById('otp').value.replace(/\s/g, '');
    const password = document.getElementById('new-password').value;
    const setBtn = document.getElementById('set-password-btn');
    const originalBtnHTML = setBtn.innerHTML;

    if (!/^\d{6}$/.test(token)) {
        showError("Enter the 6-digit code from the email");
        return;
    }
    if (password.length < 6) {
        showError("Password must be at least 6 characters");
        return;
    }

    setBtn.disabled = true;
    setBtn.innerHTML = '<span>⏳</span> Saving...';
    showError("");

    try {
        // The recovery code signs the user in; the new password is then set on that session.
        const verifyRes = await authFetch('verify', { type: 'recovery', email: pendingEmail, token });
        const session = await verifyRes.json();
        if (!verifyRes.ok) {
            const expired = session.code === 'otp_expired' || verifyRes.status === 403;
            throw new Error(expired ? "That code is invalid or has expired. Request a new one." : apiError(session, verifyRes.status));
        }

        const updateRes = await authFetch('user', { password }, { method: 'PUT', accessToken: session.access_token });
        if (!updateRes.ok) {
            const data = await updateRes.json().catch(() => ({}));
            let errorMessage = apiError(data, updateRes.status);
            if (data.code === 'same_password') errorMessage = "New password must be different from the old one.";
            if (data.code === 'weak_password') errorMessage = "Password is too weak. Use at least 6 characters.";
            // Verifying spent the code, so a retry needs a fresh one.
            document.getElementById('otp').value = "";
            throw new Error(`${errorMessage} Request a new code and try again.`);
        }

        await chrome.storage.local.set({ supabaseSession: session });
        showSuccess("Password updated. Signing you in...");
        setTimeout(() => { window.location.href = "popup.html"; }, 800);
    } catch (err) {
        showError(networkAware(err, "Couldn't reset the password."));
        setBtn.disabled = false;
        setBtn.innerHTML = originalBtnHTML;
    }
};

document.getElementById('resend-btn').onclick = async () => {
    const resendBtn = document.getElementById('resend-btn');
    resendBtn.disabled = true;
    try {
        await sendRecoveryCode(pendingEmail);
        showSuccess("A new code is on its way.");
        startResendCooldown();
    } catch (err) {
        showError(networkAware(err, "Couldn't resend the code."));
        resendBtn.disabled = false;
    }
};
