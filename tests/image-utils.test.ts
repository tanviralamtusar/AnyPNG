import { describe, expect, it } from 'vitest';
import { paddedCrop } from '../src/crop-utils';
import { binaryMask, maskBounds } from '../src/mask-utils';
import { composite } from '../src/image-utils';

class TestImageData { data: Uint8ClampedArray; width: number; height: number; constructor(dataOrWidth: Uint8ClampedArray | number, width?: number, height?: number) { if (typeof dataOrWidth === 'number') { this.width = dataOrWidth; this.height = width!; this.data = new Uint8ClampedArray(this.width * this.height * 4); } else { this.data = dataOrWidth; this.width = width!; this.height = height!; } } }
Object.defineProperty(globalThis, 'ImageData', { value: TestImageData });

function image(width: number, height: number, value = 0, alpha = 0) { const data = new Uint8ClampedArray(width * height * 4); for (let i = 0; i < data.length; i += 4) { data[i] = value; data[i + 3] = alpha; } return new ImageData(data, width, height); }

describe('mask and crop utilities', () => {
  it('finds a mask bounds rectangle', () => { const m = image(6, 5); m.data[(2 * 6 + 4) * 4] = 255; m.data[(3 * 6 + 2) * 4] = 255; expect(maskBounds(m)).toEqual({ x: 2, y: 2, width: 3, height: 2 }); });
  it('returns null for an empty mask', () => expect(maskBounds(image(2, 2))).toBeNull());
  it('clamps padded crops to image boundaries', () => expect(paddedCrop({ x: 1, y: 2, width: 3, height: 2 }, 5, 10, 8)).toEqual({ x: 0, y: 0, width: 9, height: 8 }));
  it('binarizes a mask', () => { const m = image(1, 1); m.data[0] = 128; const b = binaryMask(m); expect([...b.data]).toEqual([255, 255, 255, 255]); });
  it('preserves pixels outside the composite mask', () => { const original = image(2, 1, 10, 255), patch = image(2, 1, 200, 255), mask = image(2, 1); mask.data[0] = 255; const out = composite(original, patch, mask, { x: 0, y: 0, width: 2, height: 1 }); expect(out.data[0]).toBe(200); expect(out.data[4]).toBe(10); });
});
