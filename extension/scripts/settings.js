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
    chrome.storage.sync.get(['upscaleFactor', 'conversionQuality', 'driveDownloadFolder', 'driveDownloadConcurrency'], (result) => {
        if (result.upscaleFactor) {
            document.getElementById('upscaleFactor').value = result.upscaleFactor;
        }
        if (result.conversionQuality) {
            document.getElementById('conversionQuality').value = result.conversionQuality;
        }
        document.getElementById('driveDownloadFolder').value = result.driveDownloadFolder || 'Drive media';
        document.getElementById('driveDownloadConcurrency').value = ['1', '2', '3', '4', '5'].includes(String(result.driveDownloadConcurrency)) ? String(result.driveDownloadConcurrency) : '3';
    });

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
        const res = await rmAuthApi('me/rating', undefined, { method: 'GET', accessToken: session.access_token });
        if (res.ok) {
            const data = await res.json();
            if (data) {
                userRating = data.rating;
                highlightStars(userRating);
                if (data.comment) {
                    document.getElementById('rating-comment').value = data.comment;
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
        // The server takes the user id from the access token, not from the body.
        const payload = { rating };
        if (comment !== null) payload.comment = comment;

        const res = await rmAuthApi('me/rating', payload, { method: 'PUT', accessToken: supabaseSession.access_token });

        if (res.ok) {
            if (isExplicit) {
                status.innerText = 'Saved! Thank you for the support.';
                status.style.color = 'var(--success)';
                setTimeout(() => { status.innerText = ''; }, 3000);
            }
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to save');
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
    const accessToken = session.access_token;
    
    // Default from metadata
    const nameStr = session.user.email.split('@')[0];
    let displayName = session.user.user_metadata?.full_name || nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
    
    try {
        // Attempt to fetch from profiles table for most up-to-date name
        const res = await rmAuthApi('me/profile', undefined, { method: 'GET', accessToken });
        if (res.ok) {
            const data = await res.json();
            if (data?.full_name) {
                displayName = data.full_name;
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
        // The server updates both the profiles row and the auth metadata, and
        // returns the updated user.
        const authRes = await rmAuthApi('me/profile', { full_name: newName }, { method: 'PATCH', accessToken: supabaseSession.access_token });

        if (authRes.ok) {
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

// Reachability check only; the button treats any HTTP response as success, so
// this never needed a credential.
const API_CONFIG = { url: "https://rightmate-api.oddbirds.dev" };

// Test API Connection
document.getElementById('testBtn').addEventListener('click', async () => {
    const testStatus = document.getElementById('testStatus');

    // UI Loading State
    testStatus.innerText = 'Checking server response...';
    testStatus.style.color = 'var(--text-muted)';
    testStatus.style.opacity = '1';

    try {
        const response = await fetch(`${API_CONFIG.url}/ping`, { method: 'GET' });

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
    const conversionQuality = document.getElementById('conversionQuality').value;
    const driveDownloadFolder = document.getElementById('driveDownloadFolder').value;
    const driveDownloadConcurrency = document.getElementById('driveDownloadConcurrency').value;

    chrome.storage.sync.set({ upscaleFactor, conversionQuality, driveDownloadFolder, driveDownloadConcurrency }, () => {
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
