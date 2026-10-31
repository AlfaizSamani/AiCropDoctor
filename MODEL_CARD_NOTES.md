# Model card and attribution

## Integrated model

- Original model project: [ShyamSriKarthik/Plant-Disease-Detection](https://github.com/ShyamSriKarthik/Plant-Disease-Detection)
- Pinned source commit: `59efa6cb3921ebe5c7d5ab023b0484876bacda99`
- Architecture: torchvision EfficientNet-B5
- Checkpoint: `full_fine_tuned_b5 (1).pth`, fetched from the upstream Git LFS object on first inference
- Checkpoint size: `114811463` bytes
- Checkpoint SHA-256: `79c19efb4fb13321d87b182c1c0daa9e6e0a1e62d48d8c9fddab524b39a67610`
- Inference labels: the exact 38-element `class_names` ordering from the pinned upstream inference code, represented in `data/model_labels.json`
- Preprocessing: resize to 456 × 456, convert to tensor, normalize with means `[0.485, 0.456, 0.406]` and standard deviations `[0.229, 0.224, 0.225]`
- Inference device: CUDA when PyTorch reports it available; otherwise CPU

The upstream checkpoint serializes the complete torchvision model. The application checks its pinned size and SHA-256, then loads it with PyTorch's `weights_only=True` and a narrow allowlist of the torchvision/PyTorch classes present in this EfficientNet object. Model weights are cached outside source control; the checkpoint is not copied into the Docker image.

## Interpretation and limitations

The returned values are raw softmax model scores. They are not calibrated probabilities of correctness. The app does not claim that this checkpoint has been independently validated on representative real-farm photos. The model's fixed classes may not cover local crops, varieties, pests, nutrient problems or unfamiliar conditions; a confident-looking score can still be wrong.

The Flask app screens images only. The optional voice/text symptom note is submitted to the Flask endpoint but is not used by the image classifier. Diagnosis requires the backend and a network connection; the PWA does not perform offline inference. Uploaded photos are sent to the server for inference and are not intentionally retained as case records. Optional browser-local history contains result metadata only and never stores photographs.

Use the wording: **“AI-assisted preliminary crop-health screening. Not a confirmed crop diagnosis; verify with a qualified local agricultural advisor before treatment.”** Do not choose or apply pesticides based only on a model output.

## Attribution and license

The EfficientNet-B5 checkpoint and upstream inference reference are attributed to Shyam Sri Karthik G. The upstream repository identifies itself as MIT-licensed. This application adapts the inference integration and presentation; it does not claim to have created or trained the upstream model. Preserve this attribution and license notice in redistributed copies.

MIT License

Copyright (c) 2026 Shyam Sri Karthik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
