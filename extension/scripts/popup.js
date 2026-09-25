// The popup is a router: it decides which page the toolbar button opens.
// Session refresh and the license check both live in license.js.

async function checkSession() {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') document.body.classList.add('light-theme');

    const session = await rmGetSession();
    if (!rmAccessTokenPresent(session)) {
        window.location.replace('login.html');
        return;
    }

    // Without an activated license there is nothing to do on the dashboard, so
    // send the user straight to the page that unblocks them.
    const license = await rmGetLicenseState();
    window.location.replace(license.licensed ? 'dashboard.html' : 'license.html');
}

function rmAccessTokenPresent(session) {
    return !!(session && (session.access_token || session.session?.access_token));
}

document.addEventListener('DOMContentLoaded', checkSession);
