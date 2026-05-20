/**
 * Pro Image Tools — Offscreen Document Script
 * Performs image-to-PNG conversion using OffscreenCanvas.
 * 
 * Data is received as base64 strings (ArrayBuffer doesn't survive
 * chrome.runtime.sendMessage serialization).
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.target !== 'offscreen' || message.action !== 'convertToPng') {
        return false;
    }

    handleConversion(message.data, message.mimeType)
        .then((pngBase64) => {
            sendResponse({ data: pngBase64 });
        })
        .catch((error) => {
            console.error('[Offscreen] Conversion error:', error);
            sendResponse({ error: error.message });
        });

    // Return true to indicate async response
    return true;
});

/**
 * Convert any image base64 string to PNG using OffscreenCanvas.
 * @param {string} base64Data - The source image data as base64.
 * @param {string} mimeType - The MIME type of the source image.
 * @returns {Promise<string>} PNG data as a base64 string.
 */
async function handleConversion(base64Data, mimeType) {
    // Decode base64 to Uint8Array
    const raw = atob(base64Data);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
    }

    // Create a Blob from the binary data
    const blob = new Blob([uint8Array], { type: mimeType || 'image/png' });

    // Decode into an ImageBitmap
    const imageBitmap = await createImageBitmap(blob);

    // Create an OffscreenCanvas matching the image dimensions
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d');

    // Draw the image onto the canvas
    ctx.drawImage(imageBitmap, 0, 0);

    // Convert to PNG Blob
    const pngBlob = await canvas.convertToBlob({ type: 'image/png' });

    // Convert PNG Blob to base64 for messaging back
    const pngArrayBuffer = await pngBlob.arrayBuffer();
    const pngUint8Array = new Uint8Array(pngArrayBuffer);
    let binary = '';
    for (let i = 0; i < pngUint8Array.length; i++) {
        binary += String.fromCharCode(pngUint8Array[i]);
    }

    // Clean up
    imageBitmap.close();

    return btoa(binary);
}
