# AI Crop Doctor — integration status

Updated: 31 October 2026

## Integrated model

- The Flask + PWA application now uses the 38-class torchvision EfficientNet-B5 checkpoint from [ShyamSriKarthik/Plant-Disease-Detection](https://github.com/ShyamSriKarthik/Plant-Disease-Detection), pinned to commit `59efa6cb3921ebe5c7d5ab023b0484876bacda99`.
- The 114,811,463-byte checkpoint is fetched from its upstream Git LFS object on first inference and checked against SHA-256 `79c19efb4fb13321d87b182c1c0daa9e6e0a1e62d48d8c9fddab524b39a67610`. It is stored under `.model-cache` by default, not in Git or the Docker build.
- The original 38-class order was compared directly with the pinned upstream inference source. Preprocessing is the upstream 456 × 456 resize, tensor conversion and ImageNet normalization.
- The full torchvision model was loaded with `weights_only=True` and a restricted class allowlist. CPU loading and inference succeeded in this environment. CUDA selection is automatic but was not tested.

## Evidence collected

| Check | Result |
| --- | --- |
| `.\.venv\Scripts\python.exe -W error::ResourceWarning -m unittest discover -s tests -v` | Passed: 22 tests, 0 failures/errors. |
| `.\.venv\Scripts\python.exe -m py_compile app.py tests\test_app.py tools\evaluate_classifier.py` | Passed. |
| `node --check static\site.js`, `node --check static\app.js`, `node --check static\enhancements.js`, `node --check static\service-worker.js` | All passed. |
| Translation completeness | Four locales, 213 matching keys each; no `??` replacement strings or Unicode replacement characters. Runtime JavaScript, image alt text, and template translation keys are covered. |
| Local browser check | All seven pages were opened directly at 320, 390, 768 and 1280 px in English, Hindi, Marathi and Urdu (112 page/locale/viewport checks). No horizontal overflow or `??` replacement text was found; Urdu used RTL. Dashboard tutorial slides were checked at every locale and width (64 slide renders); all local photos and Commons credit links loaded. |
| Navigation and browser features | Direct page entry, refresh, browser back/forward, active sidebar states, and mobile drawer open/navigation were checked. Tutorial skip, replay, next/back and finish worked. Opt-in history displayed a test fixture from IndexedDB and cleared it; service worker controlled the page with `ai-crop-doctor-shell-v22`. |
| PWA shell cache | Browser activated `ai-crop-doctor-shell-v22` on the local development origin. This verifies local service-worker activation, not offline inference. |
| Local image assets | Exact user-provided PALLAVIO logo is used for About and app icons. Field, leaf and potato late-blight photos are bundled locally with source/license credits. Visible images on all seven pages loaded from the local app origin with appropriate alt text or decorative empty alt text; page illustrations do not depend on remotely hosted photos. |
| Direct HTTP page checks for `/dashboard`, `/diagnose`, `/history`, `/learn`, `/getting-started`, `/settings`, `/about` | All returned HTTP 200 from a running local Flask process. |
| Live `POST /api/diagnose` using the existing local JPEG file | Returned HTTP 200 with the expected response shape and `score_type=raw_model_score_not_calibrated`. |
| Follow-up `/api/health` | Reported `model_status=ready`, `model_loaded=true`. |

The live unlabelled local image returned:

1. Tomato — Late blight: 73.6%
2. Potato — Late blight: 6.0%
3. Corn — healthy: 3.6%

The app marked the result `uncertain`. This is a pipeline smoke test on an image with no verified ground-truth label, not a correctness result, benchmark or accuracy claim.

The downloaded file's observed size and SHA-256 matched the upstream Git LFS pointer. The checkpoint loader's verified-download and cache-reuse behavior is unit tested using a small fixture.

## Behaviour and privacy

- Flask routes, the top-three API shape, upload validation, uncertainty handling, crop-mismatch handling, PWA shell version and translations are covered by the unit suite.
- Photos are sent to the Flask server for inference and are not intentionally saved as app case records. Multipart parsing may temporarily spool data to host temporary storage. Optional IndexedDB history stores metadata only; symptom notes are submitted but are not model input. Audio is not stored.
- The interface preserves the raw-score disclaimer and does not prescribe pesticides. The updated About page identifies the original model source and stack.
- This PWA caches the interface only. Inference requires a running backend and network access. The app does not perform offline inference.
- The first-run guide is a four-slide visual tutorial with local photos, numbered step controls, translated labels, photo credits, and links into Diagnose and History. The attached PALLAVIO PNG is copied unchanged and supplies the displayed logo and generated icon sizes.

## Deployment and remaining limitations

- `Dockerfile` is configured for Gunicorn binding to `0.0.0.0:${PORT:-8080}`, a single worker, health check, CPU PyTorch and an external persistent model cache path. A Docker image build, hosted HTTPS deployment and public URL were not tested or created.
- `render.yaml` provides a Render Free Blueprint for a test deployment. The published guide explains that its 0.1 CPU/512 MB RAM, sleep, and ephemeral filesystem are not a reliability guarantee for this model. Vercel can host Flask functions, but its 4.5 MB request-body cap is below this app's 8 MB upload setting; no Vercel deployment config was added.
- `DEPLOYMENT_GUIDE.md` contains current Render/Vercel comparison and GitHub connection steps. No Render/Vercel account connection, remote deployment, hosted inference, or reliability test was performed.
- The browser checks were performed in desktop browser automation at the listed viewport sizes, not on a physical Android/iOS phone. Camera capture, microphone permissions, real speech recognition, speech synthesis voices, GPU inference, offline inference, and hosted-server behavior were not tested.
- No independent or representative field accuracy evaluation was performed. The model's raw softmax score is uncalibrated, and its fixed classes can force unfamiliar photos into known classes.
- The app is a preliminary educational screening prototype. Verify results with a qualified local agricultural advisor before treatment; never choose pesticides based only on the model.

## Startup

Windows PowerShell, from the project folder:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install torch==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cpu
python -m pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000/dashboard`. The checkpoint downloads and is verified on first analysis. For a container, use `docker build -t ai-crop-doctor .` followed by `docker run --rm -p 8080:8080 -e PORT=8080 ai-crop-doctor`; configure HTTPS at the deployment host before phone installation.
