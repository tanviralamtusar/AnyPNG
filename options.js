// Load saved settings when the options page opens
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['upscaleFactor'], (result) => {
        if (result.upscaleFactor) {
            document.getElementById('upscaleFactor').value = result.upscaleFactor;
        }
    });
});

// Save settings when the button is clicked
document.getElementById('saveBtn').addEventListener('click', () => {
    const upscaleFactor = document.getElementById('upscaleFactor').value;

    chrome.storage.sync.set({ upscaleFactor }, () => {
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
