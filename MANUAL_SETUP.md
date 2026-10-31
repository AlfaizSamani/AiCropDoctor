# Manual setup and phone deployment

## Windows PowerShell

Install Python 3.10 or 3.11 first. From the repository directory:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install torch==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cpu
python -m pip install -r requirements.txt
python app.py
```

If Python 3.11 is unavailable, use `py -3.10`. Visit `http://127.0.0.1:5000/dashboard` on the laptop (`/` redirects to the dashboard). Keep the terminal open while using Flask; press Ctrl+C to stop it. The pinned 115 MB EfficientNet-B5 checkpoint downloads on first analysis into `.model-cache`, where its size and SHA-256 are verified before loading. Keep internet access available for that first download and run a warm-up prediction before a live demonstration.

## macOS

Install a supported Python, then:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install torch==2.6.0 torchvision==0.21.0
python -m pip install -r requirements.txt
python app.py
```

## Linux

Install a supported Python, then use the CPU wheels:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install torch==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cpu
python -m pip install -r requirements.txt
python app.py
```

## Docker and HTTPS hosting

For GitHub-connected deployments, read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md). It documents the included Render Blueprint, Vercel's request-size mismatch, and why free plans are suitable only for testing this model.

Build locally:

```bash
docker build -t ai-crop-doctor .
docker run --rm -p 8080:8080 -e PORT=8080 ai-crop-doctor
```

Open `http://127.0.0.1:8080/dashboard` on the development computer. Docker starts Gunicorn with one worker and two request threads, CPU inference (or CUDA when the runtime exposes it) and an 180-second request timeout. The model is downloaded at first analysis, so allow for cold start time, internet egress and about 115 MB of persistent model-cache storage. `CROP_DOCTOR_MODEL_DIR` defaults to `/home/cropdoctor/.cache/ai-crop-doctor` in the container; mount a persistent volume there if the provider supports it. Check the host's RAM, disk, request timeout and free-tier limits before deployment.

To use a phone away from the laptop, deploy this container to a Docker-compatible host and enable HTTPS at the host's ingress. Open the real HTTPS deployment URL on the phone. There is no hosted URL supplied because a deployment has not been created. Do not use `127.0.0.1` from the phone to reach the laptop; on a phone, localhost is the phone itself.

### Install on Android

Open the HTTPS app URL in Chrome, then choose **Install app** or **Add to Home screen** from the browser menu. Keep internet access available for analysis: the PWA stores the app shell, not the server-side AI model.

### Install on iPhone/iPad

Open the HTTPS URL in Safari, tap **Share**, then **Add to Home Screen**. Browser installation support varies.

Microphone and PWA capabilities need a secure context. Voice recognition support differs by browser and may send audio to an external service; typing remains available. Local-network HTTP is only a development debugging option and is not the recommended phone install path.

## Upload and model storage

Diagnosis photos are sent to the Flask server for inference; the app does not retain them as case records or save them to its own image directory. Werkzeug's multipart parser may temporarily spool larger uploads to the host's temporary storage while parsing the request. Temporary-file cleanup, backups and retention depend on the operating system and hosting provider. Symptom notes are also submitted with the request but are not model input. The model checkpoint is downloaded and cached on the server, separately from user photos. It comes from the pinned Git LFS object in [ShyamSriKarthik/Plant-Disease-Detection](https://github.com/ShyamSriKarthik/Plant-Disease-Detection), not from this project's source tree. Its expected size and SHA-256 are recorded in `data/model_labels.json`.

### Same-Wi-Fi local development only

On Windows PowerShell, from the repository folder:

```powershell
$env:HOST = "0.0.0.0"
$env:PORT = "5000"
.\.venv\Scripts\python.exe app.py
```

Find the laptop's IPv4 address with `ipconfig`, then use `http://<laptop-LAN-IP>:5000/dashboard` on the phone. A firewall rule may be needed. `localhost` on a phone refers to that phone, not the laptop. A plain LAN HTTP origin is not generally a secure context and may disable camera, microphone and install APIs. Use HTTPS or a trusted local HTTPS setup when those features are needed. This is development-only; do not expose Flask's development server to the public internet.

## Before a demonstration

1. Start the app, then analyse one suitable leaf image while online to download and warm the model.
2. Test language switching, the Urdu right-to-left layout, upload/retake, and the uncertainty/crop-mismatch path.
3. Test the phone on the actual HTTPS URL. Browser speech recognition may be unavailable; do not depend on it for the demo.
4. Explain that there is no app field-accuracy measurement and that the model score is not a probability or diagnosis.
