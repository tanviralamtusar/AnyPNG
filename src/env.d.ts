/// <reference path="../node_modules/onnxruntime-web/types.d.ts" />
/// <reference types="@webgpu/types" />

interface Navigator {
  gpu?: { requestAdapter(): Promise<unknown> };
}
