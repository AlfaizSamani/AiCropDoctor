# AI Crop Doctor — Research notes (checked 24 October 2026)

This note is for product decisions and science-fair accuracy. Company model cards and product pages are self-reported, not independent certification.

## 1. Previous classifier research (not the integrated model)

The MobileNetV2 model discussed in the research below was replaced by the EfficientNet-B5 checkpoint documented in `MODEL_CARD_NOTES.md`. None of the following MobileNetV2 figures apply to the currently integrated model or constitute an independent evaluation of AI Crop Doctor.

The public model card for `neghani/plantvillage-mobilenetv2` describes a MobileNetV2-based classifier for 38 PlantVillage classes across 14 crops. It reports 99.17% accuracy and 98.51% macro F1 on a curated held-out PlantVillage test split (5,430 images). It also reports only 16% top-1 accuracy on a 25-image Cropped-PlantDoc final subset. These are third-party self-reported results for that earlier model; the field-style sample is very small. The card warns that lab-style images and field photos differ and that the raw softmax score can be overconfident.

Source: https://huggingface.co/neghani/plantvillage-mobilenetv2
Evaluation commit: https://huggingface.co/neghani/plantvillage-mobilenetv2/commit/40158e7d778954b661eb9f79fe556d3e2c79492d

**Implication:** those figures are historical background only. No accuracy or field-performance figure is claimed for the currently integrated EfficientNet-B5 model. Do not use any model alone to recommend treatment. The UI should say “model score” and “possible match”; the threshold remains a heuristic.

## 2. Existing solutions mean diagnosis alone is not unique

Plantix says its Crop Health API covers crop health, a disease/pest library and treatment guidance; its API page reports 57 crops, 19 languages, 800+ diagnosis combinations, 150M+ analysed field images and company-reported real-field accuracy around 73–74% vs around 95% on curated tests.

Source: https://plantix.net/en/plantix-intelligence/api-toolkit/

India's Kisan Sarathi is an existing multilingual agricultural advisory platform that connects farmers with agricultural expert networks; a June 2026 government factsheet reports links with 730+ KVKs, 100+ ICAR institutes and 65+ agricultural universities.

Source: https://www.pib.gov.in/FactsheetDetails.aspx?ModuleId=16&NoteId=150641&id=150641&lang=1&reg=5

**Implication:** do not call the image classifier or multilingual UI alone the USP. The credible prototype differentiator is how it asks for evidence, communicates uncertainty, makes voice/language access practical, and provides an orderly route to human verification.

## 3. PWA/mobile strategy

A Progressive Web App can provide one responsive, installable web interface across supported mobile and desktop browsers. Installation capabilities vary by browser and operating system. Service workers can cache the app shell, but offline behaviour must be intentionally designed; it does not make a server-side model available offline.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- https://web.dev/learn/pwa/assets-and-data

Camera/microphone access requires a secure context in modern browsers; use an HTTPS deployment for real mobile microphone features. `localhost` on a phone means the phone, not the laptop.

Source: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

**Implication:** create a mobile-first PWA and serve it plus the Flask model API from the same HTTPS origin. Explain that static UI/local history can be available offline after caching, while diagnosis requires server access. True offline diagnosis is a future on-device model workstream.

## 4. Voice access

The Web Speech API's SpeechRecognition feature has limited browser availability. Some implementations, including common Chrome use cases, may send audio to a server-based service and may not operate offline. Speech synthesis/available voices also depend on the device.

Source: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition

**Implication:** feature-detect recognition and synthesis separately, ask permission only on user action, disclose possible remote processing, support English/Hindi/Marathi/Urdu UI, and preserve tap/text fallback. Never claim voice is offline or that spoken symptom notes alter the image prediction if the model is image-only.

## 5. Future native/offline direction

Google ML Kit supports custom image classification models on Android using bundled or downloaded models. Bundling can make a model available offline, but it requires a compatible model asset and native integration/testing.

Source: https://developers.google.com/ml-kit/vision/image-labeling/custom-models/android

**Implication:** do not convert to a native Android app in the first iteration. Design a classifier interface so a future TFLite/ML Kit provider can be added without rewriting the user interface.

## 6. User need and scope

FAO summarises the global impact of plant pests and diseases: up to 40% of global crop production is lost annually to plant pests, with economic losses exceeding US$220 billion. This is context for the seriousness of crop-health issues, not a claim that this app can prevent that amount of loss.

Source: https://www.fao.org/plant-production-protection/about/en/

**Implication:** a real problem exists, but commercial adoption by this specific product is not proven. For a school science fair, demonstrate the working AI pipeline honestly. For future startup validation, interview users and expert advisors before expanding scope.
