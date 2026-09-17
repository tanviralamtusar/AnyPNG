import * as ort from 'onnxruntime-web/webgpu';
import { cropFromImage, composite } from './image-utils';
import { dilateMask, featherMask, maskBounds } from './mask-utils';
import { paddedCrop, resizeImage } from './crop-utils';
import type { InferenceSize, InpaintOptions, InpaintingProvider, TimingInfo } from './types';

export class WebGPUInpaintingProvider implements InpaintingProvider {
  private session: ort.InferenceSession | null = null;
  private modelPromise: Promise<ort.InferenceSession> | null = null;
  public lastTiming: TimingInfo = {};
  constructor(private readonly modelPath = '/models/lama.onnx') {}

  async load(): Promise<ort.InferenceSession> {
    if (!navigator.gpu) throw new Error('WebGPU is unavailable. Use a recent Chrome or Edge browser with WebGPU enabled.');
    if (!this.modelPromise) this.modelPromise = ort.InferenceSession.create(this.modelPath, { executionProviders: ['webgpu'] }).then((session: ort.InferenceSession) => { this.session = session; return session; });
    try { return await this.modelPromise; } catch (error) { this.modelPromise = null; throw new Error(`Could not load the local LaMa model at ${this.modelPath}.`); }
  }

  async inpaint(image: ImageData, mask: ImageData, options: InpaintOptions): Promise<ImageData> {
    const total = performance.now(), bounds = maskBounds(mask); if (!bounds) throw new Error('Paint an area to remove before running inpainting.');
    const session = await this.load(), dilated = dilateMask(mask, options.maskDilation), rect = paddedCrop(bounds, options.cropPadding, image.width, image.height);
    const inputSize = chooseSize(options.inferenceSize, rect.width, rect.height), imageCrop = resizeImage(cropFromImage(image, rect), inputSize, inputSize), maskCrop = resizeImage(cropFromImage(dilated, rect), inputSize, inputSize);
    options.onStatus?.('Running local AI'); const prep = performance.now();
    const pixels = new Float32Array(inputSize * inputSize * 3), maskPixels = new Float32Array(inputSize * inputSize);
    for (let i = 0; i < inputSize * inputSize; i++) { pixels[i] = imageCrop.data[i * 4] / 255; pixels[inputSize * inputSize + i] = imageCrop.data[i * 4 + 1] / 255; pixels[inputSize * inputSize * 2 + i] = imageCrop.data[i * 4 + 2] / 255; maskPixels[i] = maskCrop.data[i * 4] > 127 ? 1 : 0; }
    this.lastTiming.preprocess = performance.now() - prep;
    const imageTensor = new ort.Tensor('float32', pixels, [1, 3, inputSize, inputSize]), maskTensor = new ort.Tensor('float32', maskPixels, [1, 1, inputSize, inputSize]);
    const infer = performance.now(); let result: ort.InferenceSession.OnnxValueMapType;
    try { result = await session.run({ [session.inputNames[0]]: imageTensor, [session.inputNames[1]]: maskTensor }); } catch (error) { console.error('[AnyPNG] WebGPU inference failed', error); throw new Error('Local inference failed. The model may use an unsupported operator or require more GPU memory.'); }
    this.lastTiming.inference = performance.now() - infer; const output = result[session.outputNames[0]]; const values = output.data as Float32Array | number[];
    const patch = new ImageData(rect.width, rect.height), restored = resizeImage(maskCrop, rect.width, rect.height), compositeMask = featherMask(cropFromImage(restored, { x: 0, y: 0, width: restored.width, height: restored.height }), options.blendFeather);
    for (let i = 0; i < rect.width * rect.height; i++) { const sx = Math.min(inputSize - 1, Math.floor(i % rect.width * inputSize / rect.width)), sy = Math.min(inputSize - 1, Math.floor(Math.floor(i / rect.width) * inputSize / rect.height)), s = sy * inputSize + sx; patch.data[i * 4] = clamp(values[s] * 255); patch.data[i * 4 + 1] = clamp(values[inputSize * inputSize + s] * 255); patch.data[i * 4 + 2] = clamp(values[inputSize * inputSize * 2 + s] * 255); patch.data[i * 4 + 3] = 255; }
    options.onStatus?.('Blending result'); const comp = performance.now(), final = composite(image, patch, compositeMask, rect); this.lastTiming.composite = performance.now() - comp; this.lastTiming.total = performance.now() - total; return final;
  }
  dispose(): void { this.session?.release(); this.session = null; this.modelPromise = null; }
}
function clamp(value: number): number { return Math.max(0, Math.min(255, Math.round(value))); }
function chooseSize(size: InferenceSize, width: number, height: number): 512 | 768 | 1024 { if (size !== 'auto') return size; const area = Math.max(width, height); return area > 1800 ? 1024 : area > 900 ? 768 : 512; }
