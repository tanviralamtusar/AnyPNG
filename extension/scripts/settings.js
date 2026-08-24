// 🔒 Supabase Config
const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

let userRating = 0;

// Load saved settings when the options page opens
document.addEventListener('DOMContentLoaded', async () => {
    // Tab switching logic
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
            // Update active state in sidebar
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');

            // Switch content views
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Load sync settings
    chrome.storage.sync.get(['upscaleFactor', 'enableAdvancedPrompt', 'aiModel', 'conversionQuality', 'defaultVideoQuality', 'showYoutubeButton'], (result) => {
        if (result.upscaleFactor) {
            document.getElementById('upscaleFactor').value = result.upscaleFactor;
        }
        if (result.enableAdvancedPrompt !== undefined) {
            document.getElementById('enableAdvancedPrompt').checked = result.enableAdvancedPrompt;
        }
        if (result.aiModel) {
            document.getElementById('aiModel').value = result.aiModel;
        }
        if (result.conversionQuality) {
            document.getElementById('conversionQuality').value = result.conversionQuality;
        }
        if (result.defaultVideoQuality) {
            document.getElementById('defaultVideoQuality').value = result.defaultVideoQuality;
        }
        // Absent means "never configured", and this one is on by default.
        document.getElementById('showYoutubeButton').checked = result.showYoutubeButton !== false;
    });

    // Reconcile the cookie-auth toggle against the permission actually held: the
    // user can revoke "cookies" from chrome://extensions at any time, and the stored
    // flag alone would then lie about what the extension can do.
    (async () => {
        const { enableCookieAuth } = await chrome.storage.local.get('enableCookieAuth');
        const granted = await chrome.permissions.contains({ permissions: ['cookies'] });
        const on = !!enableCookieAuth && granted;
        document.getElementById('enableCookieAuth').checked = on;
        if (enableCookieAuth && !granted) await chrome.storage.local.set({ enableCookieAuth: false });
    })();

    // Load local settings (theme)
    chrome.storage.local.get(['theme', 'supabaseSession'], async (data) => {
        const profileSection = document.getElementById('profile-section');
        
        if (data.theme === 'light') {
            document.getElementById('themeToggle').checked = true;
            document.body.classList.add('light-theme');
        }
        
        if (data.supabaseSession) {
            await loadProfile(data.supabaseSession);
            await loadRating(data.supabaseSession);
        } else {
            profileSection.style.display = 'none';
        }
    });

    // Rating Event Listeners
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.getAttribute('data-value'));
            highlightStars(val);
        });
        
        star.addEventListener('mouseout', () => {
            highlightStars(userRating);
        });
        
        star.addEventListener('click', async () => {
            userRating = parseInt(star.getAttribute('data-value'));
            highlightStars(userRating);
            document.getElementById('feedback-container').classList.remove('hidden');
            document.getElementById('rating-text').innerText = getRatingMessage(userRating);
            await saveRating(userRating, null, false); // Auto-save star click
        });
    });

    document.getElementById('submit-rating-btn')?.addEventListener('click', async () => {
        const comment = document.getElementById('rating-comment').value;
        await saveRating(userRating, comment, true);
    });
});

function highlightStars(count) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(s => {
        const val = parseInt(s.getAttribute('data-value'));
        if (val <= count) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

function getRatingMessage(rating) {
    if (rating >= 4) return "We're glad you like it! 🚀";
    if (rating >= 3) return "Thanks for the feedback!";
    return "How can we improve?";
}

async function loadRating(session) {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/ratings?user_id=eq.${session.user.id}&select=rating,comment`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                userRating = data[0].rating;
                highlightStars(userRating);
                if (data[0].comment) {
                    document.getElementById('rating-comment').value = data[0].comment;
                }
                document.getElementById('feedback-container').classList.remove('hidden');
                document.getElementById('rating-text').innerText = getRatingMessage(userRating);
            }
        }
    } catch (e) {
        console.error('Error loading rating:', e);
    }
}

async function saveRating(rating, comment, isExplicit) {
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession) return;

    const status = document.getElementById('rating-status');
    if (isExplicit) status.innerText = 'Saving...';

    try {
        const payload = { 
            user_id: supabaseSession.user.id, 
            rating: rating
        };
        if (comment !== null) payload.comment = comment;

        const res = await fetch(`${SUPABASE_URL}/rest/v1/ratings?on_conflict=user_id`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${supabaseSession.access_token}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            if (isExplicit) {
                status.innerText = 'Saved! Thank you for the support.';
                status.style.color = 'var(--success)';
                setTimeout(() => { status.innerText = ''; }, 3000);
            }
        } else {
            const err = await res.json();
            throw new Error(err.message || 'Failed to save');
        }
    } catch (e) {
        if (isExplicit) {
            status.innerText = 'Error saving rating.';
            status.style.color = 'var(--error)';
        }
        console.error('Rating save error:', e);
    }
}

async function loadProfile(session) {
    const userId = session.user.id;
    const accessToken = session.access_token;
    
    // Default from metadata
    const nameStr = session.user.email.split('@')[0];
    let displayName = session.user.user_metadata?.full_name || nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
    
    try {
        // Attempt to fetch from profiles table for most up-to-date name
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=full_name`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0 && data[0].full_name) {
                displayName = data[0].full_name;
            }
        }
    } catch (e) {
        console.error('Error fetching profile name:', e);
    }

    document.getElementById('profile-name').innerText = displayName;
    document.getElementById('profile-email').innerText = session.user.email;
    document.getElementById('profile-avatar').innerText = displayName.charAt(0).toUpperCase();
    document.getElementById('account-name').value = displayName;
}

// Update Profile Logic
document.getElementById('updateProfileBtn')?.addEventListener('click', async () => {
    const newName = document.getElementById('account-name').value;
    const status = document.getElementById('accountStatus');
    const btn = document.getElementById('updateProfileBtn');
    
    const { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    if (!supabaseSession) return;

    const originalText = btn.innerText;
    btn.innerText = 'Updating...';
    btn.disabled = true;

    try {
        // 1. Update Profile Table
        const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${supabaseSession.user.id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${supabaseSession.access_token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ full_name: newName })
        });

        // 2. Update Auth Metadata
        const authRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${supabaseSession.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: { full_name: newName } })
        });

        if (profileRes.ok && authRes.ok) {
            // Success
            status.innerText = 'Profile updated successfully!';
            status.style.color = 'var(--success)';
            
            // Update UI
            document.getElementById('profile-name').innerText = newName;
            document.getElementById('profile-avatar').innerText = newName.charAt(0).toUpperCase();
            
            // Update local session data
            const updatedUserData = await authRes.json();
            const newSession = { ...supabaseSession, user: updatedUserData };
            await chrome.storage.local.set({ supabaseSession: newSession });
        } else {
            throw new Error('Failed to update one or more sources.');
        }
    } catch (e) {
        status.innerText = `Error: ${e.message}`;
        status.style.color = 'var(--error)';
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
        setTimeout(() => { status.innerText = ''; }, 3000);
    }
});

// Cookie auth toggle. Deliberately NOT part of the saveBtn batch: requesting an
// optional permission needs a real user gesture, which only exists inside this
// handler. Stored in storage.local rather than sync because the permission grant is
// per-device — a synced flag would read "on" where it was never granted.
document.getElementById('enableCookieAuth')?.addEventListener('change', async (e) => {
    const status = document.getElementById('cookieAuthStatus');
    const checkbox = e.target;

    if (checkbox.checked) {
        let granted = false;
        try {
            granted = await chrome.permissions.request({ permissions: ['cookies'] });
        } catch (err) {
            console.error('Cookie permission request failed:', err);
        }
        if (!granted) {
            checkbox.checked = false;
            await chrome.storage.local.set({ enableCookieAuth: false });
            status.innerText = 'Permission declined — leaving this off.';
            status.style.color = 'var(--text-muted)';
            return;
        }
        await chrome.storage.local.set({ enableCookieAuth: true });
        status.innerText = 'On. Your YouTube cookies will be sent only when a server download hits a sign-in wall.';
        status.style.color = 'var(--accent)';
        return;
    }

    await chrome.storage.local.set({ enableCookieAuth: false });
    // Hand the permission back so the extension can't read cookies while off.
    try {
        await chrome.permissions.remove({ permissions: ['cookies'] });
    } catch (err) {
        console.error('Cookie permission removal failed:', err);
    }
    status.innerText = 'Off. Cookies will never be sent.';
    status.style.color = 'var(--text-muted)';
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('change', async (e) => {
    const isLight = e.target.checked;
    if (isLight) {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    await chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
});

// 🔒 HARDCODED API CREDENTIALS (Matches background.js)
const API_CONFIG = {
    url: "https://anypng.botbhai.net",
    basicToken: "my_super_secret_hostinger_token_123!"
};

// Test API Connection
document.getElementById('testBtn').addEventListener('click', async () => {
    const testStatus = document.getElementById('testStatus');

    // UI Loading State
    testStatus.innerText = 'Checking server response...';
    testStatus.style.color = 'var(--text-muted)';
    testStatus.style.opacity = '1';

    try {
        const response = await fetch(API_CONFIG.url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${API_CONFIG.basicToken}` }
        });

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
        setTimeout(() => {
            testStatus.style.opacity = '0';
        }, 5000);
    }
});

// Save settings when the button is clicked
document.getElementById('saveBtn').addEventListener('click', () => {
    const upscaleFactor = document.getElementById('upscaleFactor').value;
    const enableAdvancedPrompt = document.getElementById('enableAdvancedPrompt').checked;
    const aiModel = document.getElementById('aiModel').value;
    const conversionQuality = document.getElementById('conversionQuality').value;
    const defaultVideoQuality = document.getElementById('defaultVideoQuality').value;
    const showYoutubeButton = document.getElementById('showYoutubeButton').checked;

    chrome.storage.sync.set({ upscaleFactor, enableAdvancedPrompt, aiModel, conversionQuality, defaultVideoQuality, showYoutubeButton }, () => {
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
    
    // Close the options page - use fallback for compatibility
    try {
        window.close();
    } catch (e) {
        window.location.href = 'chrome://extensions/';
    }
});
