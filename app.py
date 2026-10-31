import hashlib
import json
import math
import os
import re
import threading
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from typing import Protocol
from urllib.request import Request, urlopen

from flask import Flask, jsonify, make_response, redirect, render_template, request, send_from_directory, url_for
from PIL import Image, ImageOps, ImageStat, UnidentifiedImageError

APP_NAME = "AI Crop Doctor"
BASE_DIR = Path(__file__).resolve().parent
MODEL_ID = "ShyamSriKarthik/Plant-Disease-Detection"
MODEL_REVISION = "59efa6cb3921ebe5c7d5ab023b0484876bacda99"
MODEL_FILENAME = "full_fine_tuned_b5 (1).pth"
MODEL_SHA256 = "79c19efb4fb13321d87b182c1c0daa9e6e0a1e62d48d8c9fddab524b39a67610"
MODEL_SIZE_BYTES = 114_811_463
MODEL_URL = (
    "https://media.githubusercontent.com/media/"
    f"{MODEL_ID}/{MODEL_REVISION}/full_fine_tuned_b5%20%281%29.pth"
)
MODEL_CACHE_DIR = Path(os.getenv("CROP_DOCTOR_MODEL_DIR", BASE_DIR / ".model-cache"))
MODEL_CHECKPOINT = Path(os.getenv("CROP_DOCTOR_CHECKPOINT", MODEL_CACHE_DIR / MODEL_FILENAME))
_label_file = json.loads((BASE_DIR / "data" / "model_labels.json").read_text(encoding="utf-8"))
MODEL_LABELS = _label_file["classes"]
MODEL_CLASS_IDS = tuple(_label_file["class_order"])
_labels_match_model = (
    MODEL_ID == _label_file["model_id"]
    and MODEL_REVISION == _label_file["revision"]
    and len(MODEL_CLASS_IDS) == 38
    and len(set(MODEL_CLASS_IDS)) == len(MODEL_CLASS_IDS)
    and set(MODEL_CLASS_IDS) == set(MODEL_LABELS)
)


def _positive_int_env(name, default):
    try:
        value = int(os.getenv(name, str(default)))
    except ValueError:
        raise RuntimeError(f"{name} must be a positive integer.") from None
    if value < 1:
        raise RuntimeError(f"{name} must be a positive integer.")
    return value


def _threshold_env():
    try:
        value = float(os.getenv("CONFIDENCE_THRESHOLD", "0.75"))
    except ValueError:
        raise RuntimeError("CONFIDENCE_THRESHOLD must be between 0 and 1.") from None
    if not 0 <= value <= 1:
        raise RuntimeError("CONFIDENCE_THRESHOLD must be between 0 and 1.")
    return value


CONFIDENCE_THRESHOLD = _threshold_env()
MAX_UPLOAD_MB = _positive_int_env("MAX_UPLOAD_MB", 8)
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024
MAX_MULTIPART_OVERHEAD_BYTES = 64 * 1024
CROP_DOCTOR_MODE = os.getenv("CROP_DOCTOR_MODE", "development").strip().lower()

SUPPORTED_CROPS = {
    "apple", "blueberry", "cherry", "corn", "grape", "orange", "peach",
    "bell pepper", "potato", "raspberry", "soybean", "squash", "strawberry",
    "tomato",
}
CROP_ALIASES = {"maize": "corn", "pepper": "bell pepper", "pepper bell": "bell pepper"}

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_BYTES + MAX_MULTIPART_OVERHEAD_BYTES
app.config["JSON_SORT_KEYS"] = False
_classifier = None
_model_error = None
_model_loading = False
_model_lock = threading.Lock()


class ImageClassifier(Protocol):
    """Callable interface implemented by the configured image classifier."""

    def __call__(self, image, top_k=3): ...


def _checkpoint_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as checkpoint:
        for chunk in iter(lambda: checkpoint.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _ensure_model_checkpoint() -> Path:
    if MODEL_CHECKPOINT.is_file():
        if MODEL_CHECKPOINT.stat().st_size != MODEL_SIZE_BYTES or _checkpoint_sha256(MODEL_CHECKPOINT) != MODEL_SHA256:
            raise RuntimeError("The local EfficientNet checkpoint does not match the pinned upstream artifact.")
        return MODEL_CHECKPOINT

    MODEL_CHECKPOINT.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = MODEL_CHECKPOINT.with_name(MODEL_CHECKPOINT.name + ".part")
    digest = hashlib.sha256()
    downloaded = 0
    try:
        download_request = Request(MODEL_URL, headers={"User-Agent": "AI-Crop-Doctor/1.0"})
        with urlopen(download_request, timeout=60) as response, temporary_path.open("wb") as target:
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                downloaded += len(chunk)
                if downloaded > MODEL_SIZE_BYTES:
                    raise RuntimeError("The downloaded checkpoint exceeds its pinned size.")
                digest.update(chunk)
                target.write(chunk)
        if downloaded != MODEL_SIZE_BYTES or digest.hexdigest() != MODEL_SHA256:
            raise RuntimeError("The downloaded EfficientNet checkpoint failed size or SHA-256 verification.")
        os.replace(temporary_path, MODEL_CHECKPOINT)
        return MODEL_CHECKPOINT
    finally:
        if temporary_path.exists():
            temporary_path.unlink()


class EfficientNetClassifier:
    def __init__(self, model, transform, device):
        self.model = model
        self.transform = transform
        self.device = device

    def __call__(self, image, top_k=3):
        import torch

        model_input = self.transform(image.convert("RGB")).unsqueeze(0).to(self.device)
        with torch.inference_mode():
            logits = self.model(model_input)
            if logits.ndim != 2 or logits.shape[1] != len(MODEL_CLASS_IDS):
                raise RuntimeError("The EfficientNet output does not match the pinned class list.")
            probabilities = torch.nn.functional.softmax(logits[0], dim=0)
            scores, indices = torch.topk(probabilities, k=min(top_k, len(MODEL_CLASS_IDS)))
        return [
            {"label": MODEL_CLASS_IDS[index.item()], "score": score.item()}
            for score, index in zip(scores, indices)
        ]


def load_classifier() -> ImageClassifier:
    """Download, safely load and reuse the pinned EfficientNet-B5 checkpoint."""
    global _classifier, _model_error, _model_loading
    if _classifier is not None:
        return _classifier
    with _model_lock:
        if _classifier is not None:
            return _classifier
        _model_loading = True
        try:
            import torch
            from torchvision import transforms
            from torchvision.models.efficientnet import EfficientNet, MBConv
            from torchvision.ops.misc import Conv2dNormActivation, SqueezeExcitation
            from torchvision.ops.stochastic_depth import StochasticDepth

            checkpoint_path = _ensure_model_checkpoint()
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            safe_model_types = [
                EfficientNet,
                MBConv,
                torch.nn.modules.batchnorm.BatchNorm2d,
                Conv2dNormActivation,
                torch.nn.modules.pooling.AdaptiveAvgPool2d,
                StochasticDepth,
                torch.nn.modules.linear.Linear,
                torch.nn.modules.container.Sequential,
                torch.nn.modules.activation.Sigmoid,
                SqueezeExcitation,
                torch.nn.modules.dropout.Dropout,
                torch.nn.modules.conv.Conv2d,
                torch.nn.modules.activation.SiLU,
            ]
            with torch.serialization.safe_globals(safe_model_types):
                model = torch.load(checkpoint_path, map_location=device, weights_only=True)
            if not isinstance(model, torch.nn.Module):
                raise RuntimeError("The pinned checkpoint does not contain a PyTorch model.")
            if model.classifier[-1].out_features != len(MODEL_CLASS_IDS):
                raise RuntimeError("The pinned model output does not match the 38-label class list.")
            model.to(device)
            model.eval()
            transform = transforms.Compose([
                transforms.Resize((456, 456)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
            ])
            _classifier = EfficientNetClassifier(model, transform, device)
            _model_error = None
            return _classifier
        except Exception as exc:
            _model_error = f"{type(exc).__name__}: {exc}"
            app.logger.exception("Could not load image classifier.")
            raise RuntimeError("The configured image model could not be loaded.") from exc
        finally:
            _model_loading = False


def tidy_label(label):
    """Resolve only exact class IDs published by the configured model revision."""
    if not _labels_match_model:
        return "Unknown crop", "Unknown class", "Unknown class"
    label_info = MODEL_LABELS.get(str(label).strip())
    if not label_info:
        return "Unknown crop", "Unknown class", "Unknown class"
    crop = label_info["crop"]
    condition = label_info["condition"]
    return crop, condition, f"{crop} — {condition}"


def is_healthy(label):
    return "healthy" in str(label).lower()


def guidance_for(label, uncertain):
    if uncertain:
        return {"kind": "caution", "key": "uncertain", "steps_key": "advice_uncertain"}
    if is_healthy(label):
        return {"kind": "info", "key": "healthy", "steps_key": "advice_healthy"}
    return {"kind": "info", "key": "condition", "steps_key": "advice_disease"}


def _image_quality_reasons(image):
    gray_stats = ImageStat.Stat(image.convert("L"))
    brightness = gray_stats.mean[0]
    contrast = gray_stats.stddev[0]
    reasons = []
    if brightness < 15 or brightness > 245:
        reasons.append("poor_image_exposure")
    if contrast < 5:
        reasons.append("low_image_detail")
    return reasons


def _normalise_crop(crop):
    normalised = re.sub(r"\s+", " ", crop.strip().lower())
    return CROP_ALIASES.get(normalised, normalised)


def _safe_error(message, code, status, hint=None):
    body = {"status": "error", "code": code, "error": message}
    if hint:
        body["hint"] = hint
    return jsonify(body), status


@app.after_request
def add_security_headers(response):
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()")
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; "
        "script-src 'self'; connect-src 'self'; object-src 'none'; "
        "base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    )
    return response


@app.get("/")
def index():
    return redirect(url_for("dashboard"))


def _page(template, page, **context):
    response = make_response(render_template(template, current_page=page, **context))
    response.headers["Cache-Control"] = "no-cache"
    return response


@app.get("/dashboard")
def dashboard():
    return _page("dashboard.html", "dashboard")


@app.get("/diagnose")
def diagnose():
    return _page("index.html", "diagnose")


@app.get("/history")
def history():
    return _page("history.html", "history")


@app.get("/learn")
def learn():
    crop_classes = {}
    if _labels_match_model:
        for item in MODEL_LABELS.values():
            crop_classes.setdefault(item["crop"], []).append(item["condition"])
    return _page("learn.html", "learn", crop_classes=crop_classes)


@app.get("/getting-started")
def getting_started():
    return _page("getting_started.html", "getting_started")


@app.get("/settings")
def settings():
    return _page("settings.html", "settings")


@app.get("/about")
def about():
    return _page("about.html", "about", model_id=MODEL_ID, model_revision=MODEL_REVISION)


@app.get("/manifest.webmanifest")
def manifest():
    return send_from_directory(BASE_DIR, "manifest.webmanifest", mimetype="application/manifest+json")


@app.get("/service-worker.js")
def service_worker():
    response = send_from_directory(BASE_DIR / "static", "service-worker.js", mimetype="application/javascript")
    response.headers["Service-Worker-Allowed"] = "/"
    response.headers["Cache-Control"] = "no-cache"
    return response


@app.get("/model-labels.json")
def model_labels():
    return send_from_directory(BASE_DIR / "data", "model_labels.json", mimetype="application/json")


@app.get("/api/status")
@app.get("/api/health")
def api_status():
    if _classifier is not None:
        model_status = "ready"
    elif _model_loading:
        model_status = "loading"
    elif _model_error:
        model_status = "error"
    else:
        model_status = "not_loaded"
    return jsonify({
        "app": APP_NAME,
        "model_id": MODEL_ID,
        "model_revision": MODEL_REVISION,
        "model_status": model_status,
        "model_loaded": _classifier is not None,
        "model_loading": _model_loading,
        "model_error": bool(_model_error),
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "max_upload_mb": MAX_UPLOAD_MB,
        "supported_crops": sorted(SUPPORTED_CROPS),
        "inference": "server_side",
    })


@app.post("/api/diagnose")
def api_diagnose():
    if "image" not in request.files or not request.files["image"].filename:
        return _safe_error("Please choose a leaf image first.", "missing_file", 400)
    file = request.files["image"]
    crop_choice = (request.form.get("crop") or "auto").strip()
    symptom_note = (request.form.get("symptom_note") or "").strip()[:1000]

    try:
        raw = file.read(MAX_UPLOAD_BYTES + 1)
    finally:
        file.close()
    if len(raw) > MAX_UPLOAD_BYTES:
        return _safe_error(
            f"Image is too large. Maximum size is {MAX_UPLOAD_MB} MB.",
            "file_too_large",
            413,
        )
    try:
        check = Image.open(BytesIO(raw))
        if check.format not in {"JPEG", "PNG", "WEBP"}:
            return _safe_error(
                "That image format is not supported. Try a JPG, PNG or WEBP photo.",
                "unsupported_image_format",
                400,
            )
        if check.width * check.height > 40_000_000:
            return _safe_error(
                "That image has too many pixels to process safely. Use a smaller photo.",
                "image_dimensions_too_large",
                400,
            )
        check.verify()
        image = ImageOps.exif_transpose(Image.open(BytesIO(raw))).convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        return _safe_error(
            "That file could not be read as an image. Try a JPG, PNG or WEBP photo.",
            "invalid_image",
            400,
        )

    width, height = image.size
    if width < 160 or height < 160:
        return _safe_error(
            "This image is very small. Use a clearer photo with the leaf filling more of the frame.",
            "image_too_small",
            400,
        )

    quality_reasons = _image_quality_reasons(image)
    try:
        outputs = load_classifier()(image, top_k=3)
    except Exception:
        app.logger.exception("Image model loading or inference failed.")
        return _safe_error(
            "The image model is unavailable or could not analyse this photo.",
            "model_unavailable",
            503,
            "Check the setup and network connection, then retry.",
        )

    if isinstance(outputs, dict):
        outputs = [outputs]
    if not isinstance(outputs, (list, tuple)) or not outputs:
        app.logger.error("The image classifier returned no predictions.")
        return _safe_error("The model returned no prediction. Try another image.", "empty_prediction", 503)

    top = outputs[0]
    raw_label = str(top.get("label", "")).strip()
    try:
        score = float(top.get("score"))
    except (TypeError, ValueError):
        score = float("nan")
    if not raw_label or not math.isfinite(score):
        app.logger.error("The image classifier returned an invalid prediction.")
        return _safe_error("The model returned an invalid prediction. Try again.", "invalid_prediction", 503)
    score = min(1.0, max(0.0, score))
    crop, condition, display_label = tidy_label(raw_label)
    known_label = _labels_match_model and raw_label in MODEL_LABELS
    selected_crop = _normalise_crop(crop_choice)
    auto_choices = {"", "auto", "not sure", "not sure / auto"}
    unsupported_crop = selected_crop not in auto_choices and selected_crop not in SUPPORTED_CROPS
    crop_mismatch = False
    if selected_crop not in auto_choices and not unsupported_crop and known_label:
        predicted_crop = _normalise_crop(crop)
        crop_mismatch = selected_crop != predicted_crop

    reason_codes = list(quality_reasons)
    if score < CONFIDENCE_THRESHOLD:
        reason_codes.append("below_confidence_threshold")
    if crop_mismatch:
        reason_codes.append("crop_mismatch")
    if unsupported_crop:
        reason_codes.append("unsupported_crop")
    if not known_label:
        reason_codes.append("unknown_model_label")
    uncertain = bool(reason_codes)

    alternatives = []
    for item in outputs[:3]:
        alt_label = str(item.get("label", "Unknown"))
        _, _, alt_display_label = tidy_label(alt_label)
        try:
            alt_score = float(item.get("score", 0))
        except (TypeError, ValueError):
            alt_score = 0.0
        if not math.isfinite(alt_score):
            alt_score = 0.0
        alternatives.append({
            "raw_label": alt_label,
            "label": alt_display_label,
            "score": round(min(1.0, max(0.0, alt_score)) * 100, 1),
        })

    warnings = [
        "Real farm photos and unfamiliar conditions may be misclassified.",
        "The model score is not a calibrated probability or a guarantee of correctness.",
        "This is a preliminary screen, not a diagnosis. Verify with a qualified agricultural advisor before any treatment decision.",
        "Do not choose or apply pesticides based only on this result.",
    ]
    if crop_mismatch:
        warnings.insert(0, f"You selected {crop_choice}, but the model's top class is for {crop}. Confirm the crop.")
    if unsupported_crop:
        warnings.insert(0, "The selected crop is outside this model's supported crop list.")
    if quality_reasons:
        warnings.insert(0, "The photo may be too dark, bright or lacking visible detail; consider taking another photo.")

    if uncertain and CROP_DOCTOR_MODE == "development" and not app.config.get("TESTING"):
        app.logger.info("Screening deferred; reason_codes=%s", ",".join(reason_codes))

    return jsonify({
        "status": "uncertain" if uncertain else "screening_result",
        "raw_label": raw_label,
        "display_label": display_label,
        "label": display_label,
        "crop": crop,
        "condition": condition,
        "score": round(score * 100, 1),
        "score_type": "raw_model_score_not_calibrated",
        "threshold": round(CONFIDENCE_THRESHOLD * 100, 1),
        "crop_mismatch": crop_mismatch,
        "unsupported_crop": unsupported_crop,
        "uncertainty_reasons": reason_codes,
        "image_size": {"width": width, "height": height},
        "guidance": guidance_for(raw_label, uncertain),
        "alternatives": alternatives,
        "warnings": warnings,
        "symptom_note": symptom_note,
        "symptom_note_used_for_prediction": False,
        "model_id": MODEL_ID,
        "model_revision": MODEL_REVISION,
        "model": MODEL_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    })


@app.errorhandler(413)
def file_too_large(_exc):
    return _safe_error(
        f"Image is too large. Maximum size is {MAX_UPLOAD_MB} MB.",
        "file_too_large",
        413,
    )


@app.errorhandler(500)
def internal_error(_exc):
    app.logger.exception("Unexpected request failure.")
    if request.path.startswith("/api/"):
        return _safe_error("An unexpected server error occurred. Please retry.", "internal_error", 500)
    return "An unexpected server error occurred. Please retry.", 500


if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = _positive_int_env("PORT", 5000)
    print("\nAI Crop Doctor — educational screening prototype")
    print(f"Model: {MODEL_ID} (revision {MODEL_REVISION})")
    print("The model downloads on first analysis; internet is required on first use.")
    print(f"Open http://127.0.0.1:{port}/dashboard in Chrome or Edge on this computer.")
    if host == "0.0.0.0":
        print("For same-Wi-Fi development only, use this computer's LAN IP; phone browser APIs may require HTTPS.")
    print("For reliable phone use, deploy behind HTTPS.\n")
    app.run(host=host, port=port, debug=False, threaded=True)
