import type { CropRect } from './types';

export function paddedCrop(rect: CropRect, padding: number, width: number, height: number): CropRect {
  const x = Math.max(0, Math.floor(rect.x - padding)), y = Math.max(0, Math.floor(rect.y - padding));
  const right = Math.min(width, Math.ceil(rect.x + rect.width + padding)), bottom = Math.min(height, Math.ceil(rect.y + rect.height + padding));
  return { x, y, width: right - x, height: bottom - y };
}

export function cropImage(source: ImageData, rect: CropRect): ImageData {
  const out = new ImageData(rect.width, rect.height);
  for (let y = 0; y < rect.height; y++) for (let x = 0; x < rect.width; x++) {
    const si = ((rect.y + y) * source.width + rect.x + x) * 4, di = (y * rect.width + x) * 4;
    out.data.set(source.data.slice(si, si + 4), di);
  }
  return out;
}

export function resizeImage(source: ImageData, width: number, height: number): ImageData {
  const src = document.createElement('canvas'), dst = document.createElement('canvas');
  src.width = source.width; src.height = source.height; dst.width = width; dst.height = height;
  src.getContext('2d')!.putImageData(source, 0, 0);
  const ctx = dst.getContext('2d', { willReadFrequently: true })!; ctx.imageSmoothingEnabled = true; ctx.drawImage(src, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}
