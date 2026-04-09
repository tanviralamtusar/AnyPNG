/**
 * Generates simple PNG icons for the extension without external dependencies.
 * Creates gradient-colored rounded square icons at 16, 48, and 128px.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, pixelCallback) {
    // Build raw pixel data (with filter byte per row)
    const rawData = Buffer.alloc((width * 4 + 1) * height);
    for (let y = 0; y < height; y++) {
        const rowOffset = y * (width * 4 + 1);
        rawData[rowOffset] = 0; // No filter
        for (let x = 0; x < width; x++) {
            const [r, g, b, a] = pixelCallback(x, y, width, height);
            const px = rowOffset + 1 + x * 4;
            rawData[px] = r;
            rawData[px + 1] = g;
            rawData[px + 2] = b;
            rawData[px + 3] = a;
        }
    }

    const compressed = zlib.deflateSync(rawData);

    // Build PNG
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = createChunk('IHDR', encodeIHDR(width, height));
    const idat = createChunk('IDAT', compressed);
    const iend = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdr, idat, iend]);
}

function encodeIHDR(w, h) {
    const buf = Buffer.alloc(13);
    buf.writeUInt32BE(w, 0);
    buf.writeUInt32BE(h, 4);
    buf[8] = 8;  // bit depth
    buf[9] = 6;  // color type: RGBA
    buf[10] = 0; // compression
    buf[11] = 0; // filter
    buf[12] = 0; // interlace
    return buf;
}

function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation
function crc32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
        }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Color helpers
function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function drawIconPixel(x, y, w, h) {
    const nx = x / (w - 1);
    const ny = y / (w - 1);
    const t = (nx + ny) / 2;

    // Rounded rect check
    const radius = w * 0.2;
    const inset = radius;
    let inside = true;

    if (x < inset && y < inset) {
        inside = Math.hypot(x - inset, y - inset) <= radius;
    } else if (x >= w - inset && y < inset) {
        inside = Math.hypot(x - (w - inset), y - inset) <= radius;
    } else if (x < inset && y >= h - inset) {
        inside = Math.hypot(x - inset, y - (h - inset)) <= radius;
    } else if (x >= w - inset && y >= h - inset) {
        inside = Math.hypot(x - (w - inset), y - (h - inset)) <= radius;
    }

    if (!inside) return [0, 0, 0, 0];

    // Gradient: #6366f1 → #a855f7
    const r = lerp(99, 168, t);
    const g = lerp(102, 85, t);
    const b = lerp(241, 247, t);

    // Mountain/landscape shape
    const mBase = h * 0.72;
    const peak1 = h * 0.40;
    const peak2 = h * 0.43;

    // Simple mountain check with two peaks
    let mountainHeight = mBase;
    const mx = nx;
    if (mx < 0.45) {
        const mp = (mx - 0.15) / 0.30;
        if (mp >= 0 && mp <= 1) {
            mountainHeight = mBase - (mBase - peak1) * Math.max(0, 1 - Math.abs(mp - 0.67) * 3);
        }
    }
    if (mx > 0.40) {
        const mp = (mx - 0.50) / 0.35;
        if (mp >= 0 && mp <= 1) {
            const mh = mBase - (mBase - peak2) * Math.max(0, 1 - Math.abs(mp - 0.35) * 2.5);
            mountainHeight = Math.min(mountainHeight, mh);
        }
    }

    if (y >= mountainHeight && y <= mBase + h * 0.02) {
        // White mountain
        return [240, 240, 255, 230];
    }

    // Sun circle
    const sunCx = w * 0.68;
    const sunCy = h * 0.28;
    const sunR = w * 0.10;
    if (Math.hypot(x - sunCx, y - sunCy) <= sunR) {
        return [255, 255, 240, 230];
    }

    return [r, g, b, 255];
}

// Generate icons
const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, 'icons');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
    const png = createPng(size, size, drawIconPixel);
    const filePath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(filePath, png);
    console.log(`Created ${filePath} (${png.length} bytes)`);
});

console.log('Done!');
