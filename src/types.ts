export type InferenceSize = 512 | 768 | 1024 | 'auto';

export interface InpaintOptions {
  inferenceSize: InferenceSize;
  maskDilation: number;
  cropPadding: number;
  blendFeather: number;
  onStatus?: (status: string) => void;
}

export interface InpaintingProvider {
  inpaint(image: ImageData, mask: ImageData, options: InpaintOptions): Promise<ImageData>;
  dispose(): void;
}

export interface CropRect { x: number; y: number; width: number; height: number; }
export interface TimingInfo { model?: number; preprocess?: number; inference?: number; composite?: number; total?: number; }
