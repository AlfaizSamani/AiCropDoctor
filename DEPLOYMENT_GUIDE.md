# Connecting AI Crop Doctor to Render or Vercel

## Recommendation at a glance

**Render runs the Flask + PyTorch application, including its server-rendered pages and diagnosis API. The Vercel build log you shared tried to bundle 5,240.84 MB and failed its 500 MB function limit. The repository now configures Vercel as a small Node.js HTTPS gateway to Render, so PyTorch is not packaged on Vercel.**

| Provider/plan | What fits | Free-tier limits relevant here | Recommendation |
| --- | --- | --- | --- |
| Render Free Web Service | Flask/Gunicorn serves all app pages, static assets and the inference API | 0.1 CPU and 512 MB RAM; sleeps after inactivity; filesystem is ephemeral and there is no persistent disk | The model download/load may exceed free-tier memory or take too long; use for an experiment, not a reliability promise. |
| Vercel Hobby gateway | A small Node.js function forwards page, asset and API requests to Render | Vercel Function request bodies are limited to 4.5 MB. This app now limits image files to 4 MiB to leave room for multipart headers. The Vercel function does not package Python/PyTorch. | Optional Vercel public entrypoint. Render still runs Flask and serves the HTML; Vercel forwards requests to it. |

These are platform limits, not guarantees that this particular model will deploy or run successfully. Free availability can change; confirm the current terms and resource limits before relying on either service. For a service that should remain warm and respond consistently, plan for a paid backend with adequate RAM (start evaluation at 2 GB), persistent model-cache storage, and measured inference latency. A successful hosted Render+Vercel deployment has not yet been verified.

Official references, checked 31 October 2026:

- [Render Flask deployment quickstart](https://render.com/docs/deploy-flask)
- [Render free-instance limits](https://render.com/docs/free)
- [Render compute plan CPU/RAM table](https://render.com/docs/compute-plans)
- [Vercel Function limits](https://vercel.com/docs/functions/limitations)
- [Vercel Node.js Function runtime](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel project configuration](https://vercel.com/docs/project-configuration)

## Option A: connect the GitHub repository to Render

The repository includes [`render.yaml`](./render.yaml), configured as a **free-tier test service** using CPU PyTorch and Gunicorn. It does not configure a persistent disk or remove the provider's free-tier limits.

1. Push the project to `https://github.com/AlfaizSamani/AiCropDoctor` and make sure the default branch contains `render.yaml`.
2. Sign in to [Render](https://dashboard.render.com/) and connect GitHub if prompted. Grant access to `AlfaizSamani/AiCropDoctor`.
3. In Render, choose **New → Blueprint**, select that repository and the `main` branch, then review the detected `render.yaml`.
4. Create/deploy the Blueprint. Render installs the CPU-only PyTorch wheels, installs the remaining requirements, and starts the app with Gunicorn. The health check is `/api/health`.
5. Watch the build and runtime logs. When the service is live, open the assigned `https://…onrender.com/dashboard` URL. Check `/api/health` first; the model is lazy-loaded and will still show as not loaded until a diagnosis is requested.
6. Submit a small image and wait for first-use model download/loading before concluding that inference works. The service may run out of memory or time on Free; a green health check by itself does not prove that inference works.

Render deploys later GitHub commits automatically by default. A Free service may sleep and take about a minute to wake. Its filesystem is temporary, so the model can be downloaded again after sleep/restart; do not use server-local files as durable user storage. **Do not advertise this free deployment as reliably available until real inference and cold-start behavior have been tested.**

If the Free service fails while loading the model, upgrading only the workspace plan is not enough: change the web service's compute plan to a paid plan with sufficient memory. A 2 GB plan is a starting point for measurement, not a guarantee. For retained model weights across restarts, also provision a persistent disk and set `CROP_DOCTOR_MODEL_DIR` to its mount path.

## Option B: put Vercel in front of Render

The root `vercel.json` explicitly builds only `api/proxy.js` as a Node.js function and routes requests to that gateway. `.vercelignore` leaves the Flask source and `requirements.txt` out of the Vercel upload. This prevents Vercel from trying to package the 5+ GB Python/Torch inference environment shown in the build error.

Vercel is a gateway here, not a separate static frontend build: it forwards page, static-asset, service-worker and API requests to the Render Flask app. This keeps the current templates, browser history and same-origin API behavior intact without CORS changes.

After creating and deploying the Render Blueprint:

1. Copy the service's exact HTTPS origin from the Render dashboard, for example `https://your-service-name.onrender.com` (do not include `/dashboard`).
2. In Vercel, open the existing `AiCropDoctor` project → **Settings → Environment Variables**.
3. Add `RENDER_BACKEND_URL` with the exact Render HTTPS origin. Select **Production** and **Preview** if both deployment types should work.
4. Save the variable and redeploy the latest commit. New Git pushes also trigger a Vercel deployment; environment-variable changes require a redeploy.
5. Open the Vercel deployment URL and check `/api/health`, `/dashboard`, then test a photo smaller than 4 MiB. Vercel forwards all those routes to Render.

If `RENDER_BACKEND_URL` is missing or malformed, the Vercel gateway returns a clear 503 instead of silently falling back to another service. The Render free service can sleep, so the first proxied request may be slow. The gateway does not make the Render model warm or improve its availability.

The Vercel Node.js function enforces a 4,500,000-byte request-body ceiling. The Flask app's default maximum image file is 4 MiB (4,194,304 bytes) plus at most 64 KiB for multipart overhead, keeping the complete upload request below the gateway ceiling. Render Blueprint sets `MAX_UPLOAD_MB=4`; the UI, browser validation and API all use the same limit. Do not increase it without rechecking the total multipart body against Vercel's limit.

## Environment variables: which service gets what?

| Provider | Variable | Value |
| --- | --- | --- |
| Render | `CROP_DOCTOR_MODE` | Set by `render.yaml` to `production`. |
| Render | `CROP_DOCTOR_MODEL_DIR` | Set by `render.yaml`; on Free this is temporary storage. |
| Render | `MAX_UPLOAD_MB` | Set by `render.yaml` to `4`. |
| Render | `PORT` | Supplied by Render; do not set it manually. |
| Vercel | `RENDER_BACKEND_URL` | Required: your Render service's HTTPS origin. This is a URL, not a secret. |

Render and Vercel do not synchronize their settings automatically. You only enter the Render origin once in Vercel; no Vercel URL needs to be copied back into Render for this same-origin proxy setup. Do not put credentials in the backend URL.

## Phone, data and reliability notes

- Use the HTTPS URL actually issued by the host. A phone's `localhost` is the phone itself, not the hosted app or your laptop.
- PWA installation caches the interface, not the model. Diagnosis still requires a reachable backend.
- Uploaded photos are sent to the server for inference. Do not promise that photos stay on the phone.
- Optional result history remains in the current browser's IndexedDB; it is not a cloud backup.
- No public deployment URL, real-phone test, provider account, or live hosted inference is claimed by this guide.
