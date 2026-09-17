# Local model slot

Place the compatible LaMa ONNX model here as `lama.onnx` before using the local
inpainting editor. The model must accept image `[1,3,H,W]` and mask `[1,1,H,W]`
float tensors and return an RGB `[1,3,H,W]` float tensor normalized to `0..1`.
