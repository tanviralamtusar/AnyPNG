import type { CropRect } from './types';

export function imageDataFromCanvas(canvas: HTMLCanvasElement): ImageData { return canvas.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, canvas.width, canvas.height); }

export function imageDataFromBlob(blob: Blob): Promise<ImageData> {
  return createImageBitmap(blob).then(bitmap => {
    const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!; ctx.drawImage(bitmap, 0, 0); bitmap.close(); return ctx.getImageData(0, 0, canvas.width, canvas.height);
  });
}

export function cropFromImage(source: ImageData, rect: CropRect): ImageData {
  const out = new ImageData(rect.width, rect.height);
  for (let y = 0; y < rect.height; y++) out.data.set(source.data.slice(((rect.y + y) * source.width + rect.x) * 4, ((rect.y + y) * source.width + rect.x + rect.width) * 4), y * rect.width * 4);
  return out;
}

export function composite(original: ImageData, patch: ImageData, mask: ImageData, rect: CropRect): ImageData {
  const out = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
  for (let y = 0; y < rect.height; y++) for (let x = 0; x < rect.width; x++) {
    const mi = (y * mask.width + x) * 4, a = mask.data[mi] / 255, oi = ((rect.y + y) * original.width + rect.x + x) * 4, pi = (y * patch.width + x) * 4;
    if (a <= 0) continue;
    for (let c = 0; c < 3; c++) out.data[oi + c] = Math.round(out.data[oi + c] * (1 - a) + patch.data[pi + c] * a);
  }
  return out;
}

export function canvasFromImageData(image: ImageData): HTMLCanvasElement { const c = document.createElement('canvas'); c.width = image.width; c.height = image.height; c.getContext('2d')!.putImageData(image, 0, 0); return c; }
