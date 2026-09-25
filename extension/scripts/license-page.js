// License activation page. Everything it needs lives in license.js; this file
// only maps that state onto the form.

const el = (id) => document.getElementById(id);

let state = null;

document.addEventListener('DOMContentLoaded', async () => {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') document.body.classList.add('light-theme');
    await refresh({ force: true });
});

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? '—' : date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function setStatus(text, active) {
    el('status-text').textContent = text;
    el('status').classList.toggle('is-active', !!active);
}

function show(id, visible) {
    el(id).classList.toggle('hidden', !visible);
}

function render() {
    const license = state?.license || null;
    const licensed = !!state?.licensed;

    show('details', !!license);
    if (license) {
        el('detail-key').textContent = license.masked_key || '—';
        el('detail-device').textContent = license.this_device
            ? 'This device'
            : (license.device_label || 'Not activated');
        el('detail-activated').textContent = formatDate(license.activated_at);
    }

    const signedOut = state?.reason === 'no_session';
    show('signed-out', signedOut);
    show('activate-form', !licensed && !signedOut);
    show('deactivate-btn', licensed);
    show('recheck-btn', !signedOut);

    if (state?.purchaseUrl) {
        el('purchase-link').href = state.purchaseUrl;
        show('purchase-link', !licensed && !signedOut);
    }

    if (licensed) {
        setStatus('Licensed on this device', true);
        return;
    }
    if (state?.reason === 'other_device') {
        setStatus(`Active on another device (${license?.device_label || 'unknown'})`, false);
        el('activate-btn').querySelector('span').textContent = 'Use on this device instead';
        // The key is already known, so the field is only a confirmation step.
        el('key').placeholder = 'Re-enter your key to move it here';
        return;
    }
    setStatus(rmLicenseMessage(state?.reason), false);
}

async function refresh(options) {
    setStatus('Checking your license…', false);
    state = await rmGetLicenseState(options);
    render();
}

function showError(message) {
    el('error-msg').textContent = message || '';
    el('success-msg').textContent = '';
}

el('key').addEventListener('input', (event) => {
    const formatted = rmFormatKeyInput(event.target.value);
    if (formatted !== event.target.value) event.target.value = formatted;
    showError('');
});

el('activate-btn').onclick = async () => {
    const button = el('activate-btn');
    const key = el('key').value.trim();
    if (!key) return showError('Enter your license key.');

    button.disabled = true;
    const label = button.querySelector('span').textContent;
    button.querySelector('span').textContent = 'Activating…';
    showError('');

    const result = await rmActivateLicense(key);
    button.disabled = false;
    button.querySelector('span').textContent = label;

    if (!result.ok) {
        showError(result.message);
        if (result.reason === 'no_session') await refresh({ force: true });
        return;
    }
    state = result.state;
    el('key').value = '';
    el('success-msg').textContent = 'Activated on this device.';
    render();
    // The service worker caches menu state, so tell it the license changed.
    chrome.runtime.sendMessage({ action: 'LICENSE_CHANGED' }).catch(() => {});
};

el('deactivate-btn').onclick = async () => {
    const button = el('deactivate-btn');
    button.disabled = true;
    button.textContent = 'Deactivating…';

    const result = await rmDeactivateLicense();
    button.disabled = false;
    button.textContent = 'Deactivate this device';

    if (!result.ok) return showError(result.message);
    chrome.runtime.sendMessage({ action: 'LICENSE_CHANGED' }).catch(() => {});
    await refresh({ force: true });
};

el('recheck-btn').onclick = async () => {
    el('recheck-btn').disabled = true;
    await refresh({ force: true });
    chrome.runtime.sendMessage({ action: 'LICENSE_CHANGED' }).catch(() => {});
    el('recheck-btn').disabled = false;
};

el('signin-btn').onclick = () => {
    window.location.href = 'login.html';
};
