# Connecting AI Crop Doctor to Render or Vercel

## Recommendation at a glance

**Render is the better fit for this Flask + PyTorch application. Vercel can host Flask functions, but its request-size limit conflicts with this app's 8 MB image-upload setting. Neither provider's free tier is a reliable production home for the current model.**

| Provider/plan | What fits | Free-tier limits relevant here | Recommendation |
| --- | --- | --- | --- |
| Render Free Web Service | A persistent Flask/Gunicorn web process and the existing routes | 0.1 CPU and 512 MB RAM; sleeps after 15 minutes without traffic; waking can take about a minute; 750 free instance hours per workspace/month; filesystem is ephemeral and there is no persistent disk | Use only for an initial deployment experiment. The 115 MB checkpoint is downloaded at first analysis and can be lost when the service sleeps/restarts. Model loading/inference may exceed free memory or be too slow. |
| Vercel Hobby | Flask can be deployed as a Python Function | Function request/response bodies are limited to 4.5 MB, below the app's configured 8 MB upload cap. Hobby functions have 2 GB memory and a 300-second maximum duration. Python bundles are limited to 500 MB unless Large Functions are enabled; the model checkpoint is fetched at runtime and serverless files are not durable storage. | Do not use it as the live diagnosis backend without reworking upload limits and validating model cold starts. It is not a drop-in replacement for this long-running Flask service. |

These are platform limits, not guarantees that this particular model will deploy or run successfully. Free availability can change; confirm the current terms and resource limits before relying on either service. For a service that should remain warm and respond consistently, plan for a paid backend with adequate RAM (start evaluation at 2 GB), persistent model-cache storage, and measured inference latency. This project has not been deployed to either provider.

Official references, checked 31 October 2026:

- [Render Flask deployment quickstart](https://render.com/docs/deploy-flask)
- [Render free-instance limits](https://render.com/docs/free)
- [Render compute plan CPU/RAM table](https://render.com/docs/compute-plans)
- [Vercel Flask deployment guide](https://vercel.com/docs/frameworks/backend/flask)
- [Vercel Function limits](https://vercel.com/docs/functions/limitations)
- [Vercel Python runtime and bundle limits](https://vercel.com/docs/functions/runtimes/python)

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

## Option B: connect the GitHub repository to Vercel

You can import the repository, but that does **not** make Vercel a suitable free diagnosis host for the current configuration:

1. Sign in to [Vercel](https://vercel.com/dashboard), choose **Add New → Project**, connect GitHub, and import `AlfaizSamani/AiCropDoctor`.
2. If the import is recognized as Flask/Python, Vercel treats the Flask app as a serverless Python Function. Otherwise choose **Other** and refer to Vercel's [Flask guide](https://vercel.com/docs/frameworks/backend/flask).
3. Review the build and function logs before assigning a public production domain. Do not raise the app's upload cap expecting Vercel to accept larger requests: Vercel Functions reject bodies over 4.5 MB before Flask's own 8 MB validator can run.
4. Do not treat a successful page render as a successful model deployment. The image-upload endpoint, model download and cold-start inference need separate testing; this repository has no Vercel deployment config or Vercel validation result.

Vercel can be reconsidered if the upload flow is redesigned around its request-size limits and the PyTorch package/model-loading approach is validated against the current function size, duration, and cold-start limits. Using Vercel only for a separate static frontend would also require splitting the current Flask-rendered pages from the backend and configuring cross-origin/API behavior; that architecture is not included here.

## Phone, data and reliability notes

- Use the HTTPS URL actually issued by the host. A phone's `localhost` is the phone itself, not the hosted app or your laptop.
- PWA installation caches the interface, not the model. Diagnosis still requires a reachable backend.
- Uploaded photos are sent to the server for inference. Do not promise that photos stay on the phone.
- Optional result history remains in the current browser's IndexedDB; it is not a cloud backup.
- No public deployment URL, real-phone test, provider account, or live hosted inference is claimed by this guide.
