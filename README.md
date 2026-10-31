# AI Crop Doctor

An educational, uncertainty-aware plant-leaf image screening prototype for a school science exhibition. Flask serves the existing multi-page PWA and a server-side PyTorch EfficientNet-B5 classifier returns the top supported image classes; the interface explains uncertainty and encourages human verification.

**Detect Early. Check Confidence. Protect Crops Wisely.**

AI-assisted preliminary crop-health screening. Not a confirmed crop diagnosis; verify with a qualified local agricultural advisor before treatment. Do not select or apply pesticides based only on a model result.

## What is included

- Flask API and lazy-loaded EfficientNet-B5 classifier using the checkpoint published by [ShyamSriKarthik/Plant-Disease-Detection](https://github.com/ShyamSriKarthik/Plant-Disease-Detection).
- Seven distinct Flask pages with direct URLs, shared persistent hamburger/sidebar navigation, desktop collapse and a mobile drawer.
- Responsive diagnosis screen, camera/gallery image selection, photo preview, server-side size/type validation, and image-quality caution.
- English, Hindi, Marathi and Urdu interface with Urdu RTL layout; browser speech recognition and read-aloud are optional enhancements with text/tap alternatives.
- A four-step first-run tutorial and a permanent Getting Started page with setup, phone HTTPS/LAN caveats, troubleshooting, privacy and demo guidance.
- Locally bundled real photographs for the dashboard, photo guide, learning examples, tutorial and empty states, with source/license credits in `static/images/ATTRIBUTIONS.md`. The supplied PALLAVIO logo image is used unchanged for the About page and PWA icons.
- Top-three model labels, raw uncalibrated score, configured heuristic threshold, crop mismatch/unsupported class deferrals, and non-prescriptive next steps.
- Installable PWA shell with manifest, icons, service worker, offline interface and cached page navigation. Offline access does not provide image inference.
- Optional IndexedDB history is off by default, stays in this browser and never stores images. On the History page users can delete one record or clear all records.
- Docker and Render Blueprint deployment configuration. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Render/Vercel suitability and step-by-step GitHub connection instructions.
- A CSV-driven evaluation script. It evaluates only a dataset you supply; it does not create or imply accuracy results.

The model checkpoint is fetched from the original repository's Git LFS object on first inference, then verified against its pinned SHA-256 digest before safe PyTorch loading. It is not included in Git or the Docker build context. First use needs network access and about 115 MB of model storage. The original source's 38-class order and 456 × 456 ImageNet-normalized preprocessing are retained exactly.

## Requirements and Windows setup

Use Python 3.10 or 3.11, Git (optional), and an internet connection for initial dependency/model downloads. The EfficientNet-B5 checkpoint downloads lazily on first analysis and can require substantial storage and memory.

### Recommended automatic setup

From the repository folder in PowerShell:

```powershell
.\START_WINDOWS.bat
```

The script creates `.venv`, installs CPU PyTorch and project dependencies, then starts Flask. Keep the terminal open and visit **http://127.0.0.1:5000/dashboard** on that same computer (`/` redirects there). Model loading happens on the first analysis and may take several minutes.

### Manual setup (PowerShell)

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install torch==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cpu
python -m pip install -r requirements.txt
python app.py
```

If Python 3.11 is unavailable but 3.10 is installed, substitute `py -3.10`. For macOS/Linux, see [MANUAL_SETUP.md](./MANUAL_SETUP.md).

### Verify before a demo

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
node --check static\site.js
node --check static\app.js
node --check static\enhancements.js
node --check static\service-worker.js
```

Analyse a photo before the exhibition so the model is loaded and the cache is warm. Use a focused single-leaf photo in daylight.

## Phone use and installation

**Laptop `127.0.0.1` is not a phone URL.** On a phone, `localhost` points to the phone itself. For Android or iPhone/iPad away from the laptop, deploy this Flask app to a host that provides HTTPS, then open that host's own HTTPS URL on the phone. No deployment URL is included because no hosted deployment has been performed. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) before choosing a free host; neither free tier is considered reliable for this model.

1. Build and publish the Docker image to a host/account you control (example build command: `docker build -t ai-crop-doctor .`).
2. Configure the host's HTTPS ingress and set environment variables if needed; keep `HOST` at its localhost default for direct development, and let Gunicorn bind internally in the container.
3. Wait for the host to become healthy, then open the actual HTTPS URL on the phone. The first model download/inference can be slow; diagnosis needs phone internet access to the hosted backend.
4. Android: Chrome → app URL → browser menu → **Install app** or **Add to Home screen**.
5. iPhone/iPad: Safari → app URL → **Share** → **Add to Home Screen**.

PWA installation caches the interface, not the model. The app shell and local history may open offline after a successful cache, but server-side diagnosis cannot run without a connection. HTTPS is required for PWA installation and browser microphone access. Speech recognition availability varies; depending on browser/device, audio may go to an external recognition service and voice may not work offline.

For same-Wi-Fi development debugging only, from PowerShell set the bind address and run Flask:

```powershell
$env:HOST = "0.0.0.0"
$env:PORT = "5000"
.\.venv\Scripts\python.exe app.py
```

Find the laptop's LAN IPv4 address with `ipconfig` and open `http://<laptop-LAN-IP>:5000/dashboard` on the phone. Configure the laptop firewall only for the trusted local network. This is development-only; `localhost` on the phone means the phone itself. A raw `http://192.168.x.x:5000` origin is not a secure context for camera/microphone/PWA features in many browsers. Use HTTPS or a trusted local HTTPS setup for those APIs and for reliable installation. Do not expose Flask's development server to the public internet.

## Pages and navigation

- `/` redirects to `/dashboard`.
- `/dashboard` is the landing page and offers the primary diagnosis action and, only when local history is enabled, a recent-results summary.
- `/diagnose` contains photo intake, the optional voice/text note, model result and opt-in history controls.
- `/history` reads and manages opt-in IndexedDB results in this browser only.
- `/learn` lists crop classes from the configured model metadata and explains photo technique, score limitations and safe verification.
- `/getting-started` covers exact laptop startup commands, phone use, HTTPS/security caveats, troubleshooting, privacy and a demo checklist.
- `/settings` provides language, speech, history, tutorial replay and install guidance.
- `/about` explains the model, current scope, limitations, FAQs and safety notice.

The first-run tutorial can be skipped; replay it from the top bar or Settings. Language and sidebar-collapse preferences are stored in the current browser. Urdu switches the page to RTL; model class labels remain in their exact configured technical form when a reviewed translation is unavailable.

## Configuration

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `CROP_DOCTOR_MODEL_DIR` | `<project>/.model-cache` | Directory for the verified model checkpoint |
| `CROP_DOCTOR_CHECKPOINT` | `<model dir>/full_fine_tuned_b5 (1).pth` | Optional explicit checkpoint path |
| `CONFIDENCE_THRESHOLD` | `0.75` | Simple raw-score deferral heuristic (not calibrated) |
| `MAX_UPLOAD_MB` | `8` | Maximum uploaded image size |
| `HOST` | `127.0.0.1` | Local Flask bind address |
| `PORT` | `5000` | Local port (container default `8080`) |
| `CROP_DOCTOR_MODE` | `development` | Enables reason-code logs for deferred results in development |

`GET /api/health` and `/api/status` expose model readiness without loading it. `POST /api/diagnose` accepts a multipart `image`, optional `crop`, and optional `symptom_note`; typed/spoken notes are sent with the request but are not used by the image classifier. Response scores are explicitly identified as `raw_model_score_not_calibrated`, not calibrated reliability. The image is sent to the Flask server for inference and is not retained as an app case record. Werkzeug may temporarily spool larger multipart uploads to the host's temporary storage while parsing; temporary-file handling, backups and retention are host-dependent. The checkpoint is downloaded and cached on the server in `.model-cache` by default. The app does not log image contents.

## Model and evaluation honesty

No independent, representative field-accuracy result is available for this application or the integrated checkpoint. The model score is not a verified probability of correctness, and the threshold is not a field-calibrated reliability guarantee. Unknown labels, unsupported crops, poor-looking images, low scores and crop mismatches use an uncertainty path. Ask a qualified agricultural advisor to verify before any treatment decision.

An evaluation utility is provided for a separate, labelled dataset:

```powershell
.\.venv\Scripts\python.exe tools\evaluate_classifier.py data\my-labelled-images.csv
```

The CSV needs `image_path,class_id` columns; paths may be relative to the CSV. The script loads the pinned EfficientNet-B5 checkpoint, reports sample count, top-1/top-3, a confusion matrix, per-class precision/recall/F1, acceptance/uncertainty coverage, accuracy among accepted results and false-confidence examples. It prominently marks samples under 30 as small. Do not publish an accuracy claim unless the test set is representative, held out by plant/session/source where feasible, and independently labelled. No evaluation result is included because no labelled local dataset was supplied or tested.

`data/knowledge.json` intentionally has no disease-specific facts yet: add them only after a qualified reviewer verifies each source, statement and translation. Current advice remains generic and non-prescriptive.

## Demo run-through

1. Start the app and open `/dashboard`; use the sidebar or hamburger to move between real pages.
2. Analyse a clear photo once to warm the model.
3. Use **Talk me through it** to select a crop, describe visible signs, optionally note affected parts, choose a photo and confirm.
4. Deliberately choose a different supported crop to show the uncertainty path.
5. Switch through Hindi, Marathi and Urdu to demonstrate the translated UI and Urdu right-to-left layout; replay or skip the first-run tutorial.
6. If the browser supports speech recognition, tap the mic after reading its disclosure; otherwise type. Use read-aloud only after explicitly tapping it.
7. Optionally enable local history, save a result, export it and delete it. Explain that history contains no photo and stays in that browser.
8. Explain that the spoken note does not affect image prediction, the score is uncalibrated, and no pesticide/treatment is prescribed.

## Deployment and operational limits

`Dockerfile` installs CPU PyTorch, runs one Gunicorn worker, and exposes a health check. The model is downloaded on first inference; CPU cold starts and model storage can be slow and memory-intensive. Choose a host with sufficient RAM/disk and persistent storage mounted at `CROP_DOCTOR_MODEL_DIR` if the provider supports it. Free-tier sleep, bandwidth, disk and memory limits vary by provider. Configure HTTPS at the host's ingress. No credentials, hosted service, account, or public URL are included.

Before public internet exposure, configure the hosting platform's request limits/rate limiting and review its data-retention/network policies. This prototype does not include accounts, a database, application-level per-user rate limiting, local field validation, offline model inference, or expert booking.

See [MODEL_CARD_NOTES.md](./MODEL_CARD_NOTES.md) for model limitations and [AI_Crop_Doctor_Research_Notes.md](./AI_Crop_Doctor_Research_Notes.md) for product/security constraints.
