import io
import hashlib
import json
import re
import tempfile
import unittest
from unittest.mock import patch
from PIL import Image, ImageDraw
import app as app_module


class FakeClassifier:
    def __call__(self, image, top_k=3):
        return [
            {"label": "Tomato___Early_blight", "score": 0.91},
            {"label": "Tomato___Late_blight", "score": 0.05},
            {"label": "Tomato___healthy", "score": 0.04},
        ][:top_k]


class CropDoctorSmokeTests(unittest.TestCase):
    def setUp(self):
        app_module.app.config["TESTING"] = True
        self.client = app_module.app.test_client()

    def image_bytes(self):
        im = Image.new("RGB", (256, 256), (80, 145, 70))
        draw = ImageDraw.Draw(im)
        for y in range(0, 256, 12):
            shade = 90 if (y // 12) % 2 else 150
            draw.rectangle((0, y, 255, y + 5), fill=(shade, shade, shade))
        buf = io.BytesIO()
        im.save(buf, format="PNG")
        buf.seek(0)
        return buf

    @staticmethod
    def close_test_response(response):
        request_stream = response.request.environ.get("wsgi.input")
        if request_stream is not None:
            request_stream.close()
        response.close()

    def test_home_page_loads(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["Location"], "/dashboard")
        self.assertIn(b"AI Crop Doctor", self.client.get("/dashboard").data)

    def test_real_pages_render_directly_with_active_navigation(self):
        routes = {
            "/dashboard": ("dashboard", b"Dashboard"),
            "/diagnose": ("diagnose", b"Diagnose a leaf"),
            "/history": ("history", b"My history"),
            "/learn": ("learn", b"Learn about leaf screening"),
            "/getting-started": ("getting_started", b"Getting started"),
            "/settings": ("settings", b"Settings"),
            "/about": ("about", b"About and help"),
        }
        for path, (page, title) in routes.items():
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200)
                self.assertIn(title, response.data)
                self.assertRegex(
                    response.get_data(as_text=True),
                    rf'<a class="sidebar-link active" href="{re.escape(path)}"[^>]*aria-current="page"',
                )
                response.close()

    def test_ui_translation_keys_are_complete_in_all_four_languages(self):
        translations = json.loads((app_module.BASE_DIR / "static" / "ui-translations.json").read_text(encoding="utf-8"))
        expected_languages = {"en", "hi", "mr", "ur"}
        self.assertEqual(set(translations), expected_languages)
        english_keys = set(translations["en"])
        for language, copy in translations.items():
            with self.subTest(language=language):
                self.assertEqual(set(copy), english_keys)
                for key, value in copy.items():
                    if isinstance(value, str):
                        self.assertNotIn("??", value, f"{language}.{key}")
                        self.assertNotIn("\ufffd", value, f"{language}.{key}")
                for key in ("tutorial_title_1", "tutorial_title_2", "tutorial_title_3", "tutorial_title_4"):
                    self.assertTrue(copy[key])
        template_keys = set()
        for template in (app_module.BASE_DIR / "templates").glob("*.html"):
            template_text = template.read_text(encoding="utf-8")
            template_keys.update(re.findall(r'data-site-i18n="([^"]+)"', template_text))
            template_keys.update(re.findall(r'data-site-alt="([^"]+)"', template_text))
        template_keys.discard("{{ label_key }}")
        self.assertTrue(template_keys.issubset(english_keys), sorted(template_keys - english_keys))
        site_script = (app_module.BASE_DIR / "static" / "site.js").read_text(encoding="utf-8")
        runtime_keys = set(re.findall(r'\btext\(["\']([^"\']+)["\']\)', site_script))
        self.assertTrue(runtime_keys.issubset(english_keys), sorted(runtime_keys - english_keys))
        self.assertTrue({
            "nav_dashboard", "nav_diagnose", "nav_history", "nav_learn",
            "nav_getting_started", "nav_settings", "nav_about",
            "tutorial_step_1", "tutorial_step_2", "tutorial_step_3", "tutorial_step_4",
            "tutorial_title_1", "tutorial_title_2", "tutorial_title_3", "tutorial_title_4",
            "tutorial_step_label", "field_photo_alt", "leaf_photo_alt", "potato_blight_photo_alt",
        }.issubset(english_keys))
        self.assertEqual(translations["ur"]["locale"], "ur-PK")

    def test_locally_bundled_visual_assets_are_served(self):
        asset_names = ("field-intercropping.jpg", "tamarillo-leaf.jpg", "potato-late-blight.jpg")
        for asset in asset_names:
            with self.subTest(asset=asset):
                response = self.client.get(f"/static/images/{asset}")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.mimetype, "image/jpeg")
                with Image.open(io.BytesIO(response.data)) as image:
                    self.assertEqual(image.format, "JPEG")
                    self.assertGreater(image.width, 500)
                response.close()
        logo = self.client.get("/static/images/pallavio-logo.png")
        self.assertEqual(logo.status_code, 200)
        self.assertEqual(logo.mimetype, "image/png")
        with Image.open(io.BytesIO(logo.data)) as image:
            self.assertEqual(image.size, (768, 768))
        logo.close()
        brand_mark = self.client.get("/static/icons/brand-mark.png")
        self.assertEqual(brand_mark.status_code, 200)
        self.assertEqual(brand_mark.mimetype, "image/png")
        brand_mark.close()
        app_icon = self.client.get("/static/icons/icon-192.png")
        self.assertEqual(app_icon.status_code, 200)
        with Image.open(io.BytesIO(app_icon.data)) as icon:
            self.assertEqual(icon.size, (192, 192))
        app_icon.close()

    def test_diagnosis_assets_and_form_survive_a_nested_route(self):
        page = self.client.get("/diagnose")
        self.assertIn(b"/static/images/tamarillo-leaf.jpg", page.data)
        self.assertIn(b'id="diagnosis-form"', page.data)
        self.assertIn(b'id="image-input"', page.data)
        site = self.client.get("/static/site.js")
        self.assertEqual(site.status_code, 200)
        site.close()
        styles = self.client.get("/static/redesign.css")
        self.assertEqual(styles.status_code, 200)
        styles.close()

    def test_tutorial_has_visual_slides_and_functional_page_actions(self):
        page_response = self.client.get("/dashboard")
        page = page_response.get_data(as_text=True)
        page_response.close()
        self.assertIn('id="tutorial-visual"', page)
        self.assertIn('id="tutorial-dots"', page)
        self.assertIn('id="tutorial-action"', page)
        script_response = self.client.get("/static/site.js")
        script = script_response.get_data(as_text=True)
        script_response.close()
        for photo in ("field-intercropping.jpg", "tamarillo-leaf.jpg", "potato-late-blight.jpg"):
            self.assertIn(photo, script)
        self.assertIn('href: "/diagnose"', script)
        self.assertIn('href: "/history"', script)

    def test_status_does_not_load_model(self):
        response = self.client.get("/api/status")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["model_status"], "not_loaded")
        self.assertEqual(self.client.get("/api/health").status_code, 200)

    def test_upload_limit_fits_under_vercel_function_request_cap(self):
        self.assertLessEqual(app_module.MAX_UPLOAD_MB, 4)
        total_request_limit = app_module.MAX_UPLOAD_BYTES + app_module.MAX_MULTIPART_OVERHEAD_BYTES
        self.assertLessEqual(total_request_limit, 4_500_000)
        self.assertEqual(app_module.app.config["MAX_CONTENT_LENGTH"], total_request_limit)

        vercel = json.loads((app_module.BASE_DIR / "vercel.json").read_text(encoding="utf-8"))
        self.assertEqual(vercel["builds"], [{"src": "api/proxy.js", "use": "@vercel/node"}])
        self.assertEqual(vercel["routes"][0]["dest"], "/api/proxy?__crop_doctor_path=/$1")
        proxy = (app_module.BASE_DIR / "api" / "proxy.js").read_text(encoding="utf-8")
        self.assertIn("RENDER_BACKEND_URL", proxy)
        self.assertIn("MAX_REQUEST_BYTES = 4_500_000", proxy)
        self.assertIn("const MAX_BYTES = 4 * 1024 * 1024", (app_module.BASE_DIR / "static" / "enhancements.js").read_text(encoding="utf-8"))
        diagnosis_template = (app_module.BASE_DIR / "templates" / "index.html").read_text(encoding="utf-8")
        self.assertIn("Up to 4 MB", diagnosis_template)
        self.assertNotIn("8 MB", diagnosis_template)

    def test_missing_photo_is_rejected(self):
        response = self.client.post("/api/diagnose", data={})
        self.assertEqual(response.status_code, 400)

    def test_image_at_configured_limit_is_not_rejected_for_multipart_overhead(self):
        image = self.image_bytes().getvalue()
        image = image.ljust(app_module.MAX_UPLOAD_BYTES, b"\0")
        with patch.object(app_module, "load_classifier", return_value=FakeClassifier()):
            response = self.client.post("/api/diagnose", data={
                "image": (io.BytesIO(image), "leaf.png", "image/png"),
                "crop": "Tomato",
            }, content_type="multipart/form-data")
        try:
            self.assertEqual(response.status_code, 200, response.get_data(as_text=True))
            self.assertEqual(response.get_json()["image_size"], {"width": 256, "height": 256})
        finally:
            self.close_test_response(response)

    def test_image_over_configured_limit_is_rejected(self):
        response = self.client.post("/api/diagnose", data={
            "image": (io.BytesIO(b"x" * (app_module.MAX_UPLOAD_BYTES + 1)), "leaf.png", "image/png"),
        }, content_type="multipart/form-data")
        try:
            self.assertEqual(response.status_code, 413)
            self.assertEqual(response.get_json()["code"], "file_too_large")
        finally:
            self.close_test_response(response)

    def test_diagnosis_route_with_mock_model(self):
        with patch.object(app_module, "load_classifier", return_value=FakeClassifier()):
            response = self.client.post("/api/diagnose", data={
                "image": (self.image_bytes(), "leaf.png"),
                "crop": "Tomato",
                "symptom_note": "yellow and brown spots",
            }, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.get_data(as_text=True))
        payload = response.get_json()
        self.assertEqual(payload["crop"], "Tomato")
        self.assertEqual(payload["condition"], "Early blight")
        self.assertEqual(payload["status"], "screening_result")
        self.assertFalse(payload["symptom_note_used_for_prediction"])
        self.assertEqual(payload["score_type"], "raw_model_score_not_calibrated")
        self.assertEqual(payload["display_label"], "Tomato — Early blight")
        self.assertTrue(payload["timestamp"])
        self.assertEqual(payload["alternatives"][0]["raw_label"], "Tomato___Early_blight")
        self.assertEqual(payload["model_id"], app_module.MODEL_ID)

    def test_crop_mismatch_routes_to_uncertain(self):
        with patch.object(app_module, "load_classifier", return_value=FakeClassifier()):
            response = self.client.post("/api/diagnose", data={
                "image": (self.image_bytes(), "leaf.png"),
                "crop": "Potato",
            }, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload["crop_mismatch"])
        self.assertEqual(payload["status"], "uncertain")
        self.assertIn("crop_mismatch", payload["uncertainty_reasons"])

    def test_invalid_image_is_rejected_without_loading_model(self):
        response = self.client.post("/api/diagnose", data={
            "image": (io.BytesIO(b"not an image"), "leaf.png"),
        }, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["code"], "invalid_image")

    def test_non_supported_image_format_is_rejected(self):
        image = Image.new("RGB", (256, 256), (80, 145, 70))
        body = io.BytesIO()
        image.save(body, format="BMP")
        body.seek(0)
        response = self.client.post("/api/diagnose", data={
            "image": (body, "leaf.bmp"),
        }, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["code"], "unsupported_image_format")

    def test_low_detail_photo_is_deferred_as_uncertain(self):
        image = Image.new("RGB", (256, 256), (80, 145, 70))
        body = io.BytesIO()
        image.save(body, format="PNG")
        body.seek(0)
        with patch.object(app_module, "load_classifier", return_value=FakeClassifier()):
            response = self.client.post("/api/diagnose", data={
                "image": (body, "flat.png"),
                "crop": "Tomato",
            }, content_type="multipart/form-data")
        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(payload["status"], "uncertain")
        self.assertIn("low_image_detail", payload["uncertainty_reasons"])

    def test_unknown_class_and_unsupported_crop_are_marked_uncertain(self):
        class UnknownClassifier:
            def __call__(self, image, top_k=3):
                return [{"label": "Unknown_Class", "score": 0.98}]

        with patch.object(app_module, "load_classifier", return_value=UnknownClassifier()):
            response = self.client.post("/api/diagnose", data={
                "image": (self.image_bytes(), "leaf.png"),
                "crop": "Rice",
            }, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertEqual(payload["status"], "uncertain")
        self.assertTrue(payload["unsupported_crop"])
        self.assertIn("unsupported_crop", payload["uncertainty_reasons"])
        self.assertIn("unknown_model_label", payload["uncertainty_reasons"])
        self.assertEqual(payload["display_label"], "Unknown class")

    def test_model_failure_returns_safe_error_without_exception_details(self):
        with patch.object(app_module, "load_classifier", side_effect=RuntimeError("secret local path")):
            response = self.client.post("/api/diagnose", data={
                "image": (self.image_bytes(), "leaf.png"),
                "crop": "Tomato",
            }, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.get_json()["code"], "model_unavailable")
        self.assertNotIn("secret local path", response.get_data(as_text=True))

    def test_pwa_routes_and_security_headers(self):
        page = self.client.get("/dashboard")
        self.assertIn(b"manifest.webmanifest", page.data)
        self.assertEqual(page.headers["X-Content-Type-Options"], "nosniff")
        manifest_response = self.client.get("/manifest.webmanifest")
        self.assertEqual(manifest_response.status_code, 200)
        manifest = json.loads(manifest_response.get_data(as_text=True))
        manifest_response.close()
        self.assertEqual(manifest["display"], "standalone")
        self.assertEqual(len(manifest["icons"]), 3)
        worker = self.client.get("/service-worker.js")
        self.assertEqual(worker.status_code, 200)
        self.assertEqual(worker.headers["Service-Worker-Allowed"], "/")
        self.assertIn(b"request.method !== \"GET\"", worker.data)
        self.assertIn(b"/api/", worker.data)
        self.assertIn(b"const CACHE_NAME = `${CACHE_PREFIX}v23`", worker.data)
        self.assertIn(b'request.mode === "navigate"', worker.data)
        self.assertIn(b"caches.match(request)", worker.data)
        self.assertIn(b"cache.put(request, copy)", worker.data)
        self.assertNotIn(b'cache.put("/", copy)', worker.data)
        for route in (b"/dashboard", b"/diagnose", b"/history", b"/learn", b"/getting-started", b"/settings", b"/about"):
            self.assertIn(route, worker.data)
        self.assertIn(b"/static/images/field-intercropping.jpg", worker.data)
        self.assertIn(b"/static/images/tamarillo-leaf.jpg", worker.data)
        self.assertIn(b"/static/images/potato-late-blight.jpg", worker.data)
        self.assertIn(b"/static/icons/brand-mark.png", worker.data)
        self.assertIn(b"/static/images/pallavio-logo.png", worker.data)
        self.assertIn(b"/static/ui-translations.json", worker.data)
        worker.close()
        labels = self.client.get("/model-labels.json")
        self.assertEqual(labels.status_code, 200)
        self.assertEqual(len(labels.get_json()["classes"]), 38)
        labels.close()

    def test_unknown_class_parser_does_not_invent_a_crop(self):
        self.assertEqual(app_module.tidy_label("mystery_label"), ("Unknown crop", "Unknown class", "Unknown class"))
        self.assertEqual(len(app_module.MODEL_LABELS), 38)
        self.assertEqual(app_module.tidy_label("Corn_(maize)___Common_rust_"), ("Corn", "Common rust", "Corn — Common rust"))

    def test_pinned_efficientnet_metadata_and_class_order(self):
        labels = json.loads((app_module.BASE_DIR / "data" / "model_labels.json").read_text(encoding="utf-8"))
        self.assertEqual(app_module.MODEL_ID, "ShyamSriKarthik/Plant-Disease-Detection")
        self.assertEqual(app_module.MODEL_REVISION, "59efa6cb3921ebe5c7d5ab023b0484876bacda99")
        self.assertEqual(len(app_module.MODEL_CLASS_IDS), 38)
        self.assertEqual(app_module.MODEL_CLASS_IDS, tuple(labels["classes"]))
        self.assertEqual(app_module.MODEL_CLASS_IDS[0], "Apple___Apple_scab")
        self.assertEqual(app_module.MODEL_CLASS_IDS[30], "Tomato___Late_blight")
        self.assertEqual(labels["checkpoint_sha256"], app_module.MODEL_SHA256)
        self.assertEqual(labels["preprocessing"]["resize"], [456, 456])
        self.assertEqual(labels["preprocessing"]["normalize_mean"], [0.485, 0.456, 0.406])
        self.assertEqual(labels["preprocessing"]["normalize_std"], [0.229, 0.224, 0.225])

    def test_checkpoint_download_is_verified_and_reused(self):
        checkpoint_bytes = b"verified checkpoint fixture"
        with tempfile.TemporaryDirectory() as directory:
            checkpoint_path = app_module.Path(directory) / app_module.MODEL_FILENAME
            with (
                patch.object(app_module, "MODEL_CHECKPOINT", checkpoint_path),
                patch.object(app_module, "MODEL_SIZE_BYTES", len(checkpoint_bytes)),
                patch.object(app_module, "MODEL_SHA256", hashlib.sha256(checkpoint_bytes).hexdigest()),
                patch.object(app_module, "urlopen", return_value=io.BytesIO(checkpoint_bytes)) as open_url,
            ):
                self.assertEqual(app_module._ensure_model_checkpoint(), checkpoint_path)
                self.assertEqual(checkpoint_path.read_bytes(), checkpoint_bytes)
                self.assertEqual(app_module._ensure_model_checkpoint(), checkpoint_path)
                open_url.assert_called_once()

    def test_efficientnet_classifier_maps_top_logits_to_pinned_labels(self):
        import torch

        class FixedLogits:
            def __call__(self, _image):
                logits = torch.zeros((1, len(app_module.MODEL_CLASS_IDS)))
                logits[0, 30] = 4
                logits[0, 21] = 2
                logits[0, 10] = 1
                return logits

        classifier = app_module.EfficientNetClassifier(
            FixedLogits(),
            lambda _image: torch.zeros((3, 1, 1)),
            torch.device("cpu"),
        )
        predictions = classifier(Image.new("RGB", (160, 160)), top_k=3)
        self.assertEqual(
            [prediction["label"] for prediction in predictions],
            ["Tomato___Late_blight", "Potato___Late_blight", "Corn_(maize)___healthy"],
        )
        self.assertGreater(predictions[0]["score"], predictions[1]["score"])


if __name__ == "__main__":
    unittest.main()
