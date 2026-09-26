// Matches the "Minimum interval per user" in Supabase's SMTP settings.
const RESEND_COOLDOWN_SECONDS = 60;

const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');
let pendingEmail = '';

document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();
    // login.js sends unconfirmed users here to enter their code.
    const verifyEmail = new URLSearchParams(location.search).get('verify');
    if (verifyEmail) {
        showVerifyStep(verifyEmail);
        showSuccess("Enter the code we emailed you to finish signing up.");
    }
});

async function loadTheme() {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

function authFetch(path, body) {
    return rmAuthApi(`auth/${path}`, body);
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

function showVerifyStep(email) {
    pendingEmail = email;
    document.getElementById('verify-email').innerText = email;
    document.getElementById('signup-step').classList.add('hidden');
    document.getElementById('verify-step').classList.remove('hidden');
    document.getElementById('otp').focus();
    startResendCooldown();
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

document.getElementById('signup-btn').onclick = async () => {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const signupBtn = document.getElementById('signup-btn');
    const originalBtnHTML = signupBtn.innerHTML;

    if (!fullname || !email || !password) {
        showError("Please fill in all fields");
        return;
    }

    signupBtn.disabled = true;
    signupBtn.innerHTML = '<span>⏳</span> Loading...';
    showError("");

    try {
        const res = await authFetch('signup', {
            email,
            password,
            data: {
                full_name: fullname
            }
        });

        const data = await res.json();

        if (!res.ok) {
            let errorMessage = apiError(data, res.status);

            if (data.code) {
                switch (data.code) {
                    case 'weak_password':
                        errorMessage = "Password is too weak. Use at least 6 characters.";
                        break;
                    case 'user_already_exists':
                    case 'email_exists':
                        errorMessage = "An account with this email already exists";
                        break;
                }
            }
            throw new Error(errorMessage);
        }

        const accessToken = data.access_token || (data.session && data.session.access_token);

        if (!accessToken) {
            if (data.id || (data.user && data.user.id)) {
                // Email confirmation is on: Supabase emailed a code instead of a session.
                showVerifyStep(email);
                return;
            }
            throw new Error("No access token received from server");
        }

        await chrome.storage.local.set({ supabaseSession: data });
        // popup.html routes on to the dashboard or the license page.
        window.location.href = "popup.html";
    } catch (err) {
        showError(networkAware(err, "Signup failed."));
    } finally {
        signupBtn.disabled = false;
        signupBtn.innerHTML = originalBtnHTML;
    }
};

document.getElementById('verify-btn').onclick = async () => {
    const token = document.getElementById('otp').value.replace(/\s/g, '');
    const verifyBtn = document.getElementById('verify-btn');
    const originalBtnHTML = verifyBtn.innerHTML;

    if (!/^\d{6}$/.test(token)) {
        showError("Enter the 6-digit code from the email");
        return;
    }

    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<span>⏳</span> Verifying...';
    showError("");

    try {
        const res = await authFetch('verify', { type: 'signup', email: pendingEmail, token });
        const data = await res.json();

        if (!res.ok) {
            const expired = data.code === 'otp_expired' || res.status === 403;
            throw new Error(expired ? "That code is invalid or has expired. Request a new one." : apiError(data, res.status));
        }
        if (!data.access_token) {
            throw new Error("No access token received from server");
        }

        await chrome.storage.local.set({ supabaseSession: data });
        window.location.href = "popup.html";
    } catch (err) {
        showError(networkAware(err, "Verification failed."));
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = originalBtnHTML;
    }
};

document.getElementById('otp').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('verify-btn').click();
});

document.getElementById('resend-btn').onclick = async () => {
    const resendBtn = document.getElementById('resend-btn');
    resendBtn.disabled = true;
    try {
        const res = await authFetch('resend', { type: 'signup', email: pendingEmail });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(apiError(data, res.status));
        }
        showSuccess("A new code is on its way.");
        startResendCooldown();
    } catch (err) {
        showError(networkAware(err, "Couldn't resend the code."));
        resendBtn.disabled = false;
    }
};
