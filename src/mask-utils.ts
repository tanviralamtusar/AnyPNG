import type { CropRect } from './types';

export function maskBounds(mask: ImageData): CropRect | null {
  let minX = mask.width, minY = mask.height, maxX = -1, maxY = -1;
  for (let y = 0; y < mask.height; y++) for (let x = 0; x < mask.width; x++) {
    if (mask.data[(y * mask.width + x) * 4 + 3] > 0 || mask.data[(y * mask.width + x) * 4] > 0) {
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export function binaryMask(mask: ImageData): ImageData {
  const out = new ImageData(mask.width, mask.height);
  for (let i = 0; i < mask.data.length; i += 4) {
    const value = mask.data[i] > 127 || mask.data[i + 3] > 127 ? 255 : 0;
    out.data[i] = out.data[i + 1] = out.data[i + 2] = value; out.data[i + 3] = 255;
  }
  return out;
}

export function dilateMask(mask: ImageData, radius: number): ImageData {
  if (radius <= 0) return binaryMask(mask);
  const src = binaryMask(mask), out = new ImageData(mask.width, mask.height), r2 = radius * radius;
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
    let hit = false;
    for (let dy = -radius; dy <= radius && !hit; dy++) for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy > r2) continue;
      const sx = x + dx, sy = y + dy;
      if (sx >= 0 && sy >= 0 && sx < src.width && sy < src.height && src.data[(sy * src.width + sx) * 4] > 0) { hit = true; break; }
    }
    const i = (y * src.width + x) * 4; out.data[i] = out.data[i + 1] = out.data[i + 2] = hit ? 255 : 0; out.data[i + 3] = 255;
  }
  return out;
}

export function featherMask(mask: ImageData, radius: number): ImageData {
  if (radius <= 0) return mask;
  const out = new ImageData(mask.width, mask.height), r = Math.ceil(radius);
  for (let y = 0; y < mask.height; y++) for (let x = 0; x < mask.width; x++) {
    let sum = 0, count = 0;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const sx = x + dx, sy = y + dy;
      if (sx >= 0 && sy >= 0 && sx < mask.width && sy < mask.height) { sum += mask.data[(sy * mask.width + sx) * 4]; count++; }
    }
    const i = (y * mask.width + x) * 4, v = Math.round(sum / count);
    out.data[i] = out.data[i + 1] = out.data[i + 2] = v; out.data[i + 3] = 255;
  }
  return out;
}
