import { createWorker, type ImageLike } from 'tesseract.js';

let workerPromise: ReturnType<typeof createWorker> | null = null;

export async function detectRepeatedWatermarkText(image: ImageData): Promise<ImageData> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width; canvas.height = image.height;
  canvas.getContext('2d', { willReadFrequently: true })!.putImageData(image, 0, 0);
  workerPromise ??= createWorker('eng');
  const worker = await workerPromise;
  const result = await worker.recognize(canvas as unknown as ImageLike);
  const words = (result.data as unknown as { words?: Array<{ text: string; confidence?: number; bbox: { x0: number; y0: number; x1: number; y1: number } }> }).words ?? [];
  const counts = new Map<string, number>();
  for (const word of words) {
    const key = word.text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (key.length >= 3 && (word.confidence ?? 0) >= 45) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const repeated = new Set([...counts].filter(([, count]) => count >= 2).map(([key]) => key));
  const mask = new ImageData(image.width, image.height);
  for (const word of words) {
    const key = word.text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (!repeated.has(key)) continue;
    const left = Math.max(0, Math.floor(word.bbox.x0 - 12));
    const top = Math.max(0, Math.floor(word.bbox.y0 - 12));
    const right = Math.min(image.width, Math.ceil(word.bbox.x1 + 12));
    const bottom = Math.min(image.height, Math.ceil(word.bbox.y1 + 12));
    for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
      const i = (y * image.width + x) * 4;
      mask.data[i] = mask.data[i + 1] = mask.data[i + 2] = 255; mask.data[i + 3] = 255;
    }
  }
  return mask;
}
