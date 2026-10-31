(() => {
  "use strict";

  const COPY = {
    en: {
      locale: "en-IN", dir: "ltr",
      language_label: "Language", home_link: "AI Crop Doctor home", hero_eyebrow: "FIELD-FIRST · HUMAN-VERIFIED",
      photo_input: "Take or choose a leaf photo", preview_alt: "Selected leaf photo preview",
      footer_label: "AI CROP DOCTOR · SCHOOL SCIENCE EXHIBITION",
      offline_message: "You are offline. The app shell and saved history may be available, but image analysis needs the server.",
      retry: "Retry", install_app: "Install app", nav_diagnose: "Diagnose", nav_learn: "How it works", nav_history: "History",
      nav_settings: "Settings", main_sections: "Main sections", settings_title: "Language and accessibility",
      settings_language: "The language selector applies to the interface, guided questions, safety notes and read-aloud language.",
      focus_language: "Choose interface language",
      retry_analysis: "Retry analysis",
      settings_accessibility: "Voice controls are optional. Use the microphone only after tapping it; typing and crop selection remain available. The layout supports keyboard focus and Urdu right-to-left reading.",
      talk_me: "Talk me through it", choose_gallery: "Choose from gallery",
      photo_tip: "Photo tip: one leaf, in focus, in daylight; avoid heavy shadows. Use JPG, PNG or WEBP, up to 4 MB.",
      speech_privacy: "Voice recognition depends on your browser and may send audio to an external service. It may not work offline.",
      mic_consent: "Continue with voice recognition?", upload_privacy: "The photo is sent to the server for analysis. Uploads may be temporarily stored by the server host; this app does not create a case record.",
      score_caveat: "Raw model score; not a calibrated probability of correctness.",
      safety_reminder: "AI-assisted preliminary crop-health screening. Not a confirmed crop diagnosis; verify with a qualified local agricultural advisor before treatment.",
      learn_summary: "How this screening works and its limits",
      learn_model: "A published image-classification model compares the uploaded leaf photo with supported image classes. The spoken or typed note does not change the model prediction.",
      learn_score: "The displayed score is the model's raw score, not a measured probability. The threshold is a simple heuristic and has not been calibrated on local field photos.",
      learn_limits: "The model card reports results on curated and small field-style samples; these are not measurements of this app. The app has not been independently validated on local farm images.",
      learn_safety: "A possible match is not a confirmed diagnosis. Do not choose or apply pesticides based only on this output. Ask a qualified local agricultural advisor before treatment decisions.",
      history_label: "ON THIS DEVICE", history_title: "Recent history", history_intro: "History is optional and stays in this browser. Images are never included.",
      history_optin: "Save results on this device", history_off: "Local history is off. New results will not be saved.",
      export_history: "Export JSON", clear_history: "Clear all", history_saved: "Saved on this device only. No photos are saved.",
      history_empty: "No saved results yet.", history_delete: "Delete", history_confirm_clear: "Delete all saved results from this device?",
      history_deleted: "Saved history deleted.", history_saved_toast: "Result saved on this device.", history_unavailable: "Local history is unavailable in this browser.",
      export_empty: "There are no saved results to export.", install_help: "Install and use on a phone",
      android_help: "Android: open the HTTPS app URL in Chrome, then use the browser menu's Install app or Add to Home screen.",
      ios_help: "iPhone/iPad: open the HTTPS app URL in Safari, tap Share, then Add to Home Screen.",
      offline_help: "The installed app can cache its interface, but image analysis still needs an internet connection to the Flask model server. A secure HTTPS deployment is needed for installability and microphone access.",
      guided_label: "GUIDED INTAKE", crop_label_short: "Choose a crop", take_photo: "Take a photo",
      speak_answer: "Speak answer", replay_prompt: "Replay prompt", skip: "Skip", back: "Back", next: "Next",
      step_crop: "Which crop is this? Choose from the supported crop list, or leave it as not sure.",
      step_symptom: "What changes or marks do you notice on the leaf? You can speak or type, or skip this question.",
      step_parts: "Which leaves or plant parts are affected? This note is optional and will not change the image prediction.",
      step_photo: "Take a clear close-up photo of one leaf, or choose an existing photo from your gallery.",
      step_confirm: "Review the details and confirm before the image is sent to the server for analysis.",
      progress: "Step {current} of {total}", prompt_replay: "I could not replay this prompt.",
      notes_label: "Notes",
      mic_unsupported: "Voice input is not supported here. You can type or use the crop selector instead.",
      mic_permission: "Microphone access was not allowed. Check browser permissions, or continue by typing.",
      mic_no_speech: "No speech was recognised. Try again or type your answer.",
      mic_listening: "Listening… speak now. Tap Stop listening when finished.",
      mic_stop: "Stop listening", mic_idle: "Speak", mic_added: "Voice note added.",
      mic_transcribing: "Transcribing…", crop_not_matched: "I could not match that crop name. Please choose it from the list or type it.",
      image_missing: "Choose a leaf photo before continuing.", file_type: "Use a JPG, PNG or WEBP image.",
      invalid_image: "The selected file could not be read as an image. Try another JPG, PNG or WEBP photo.",
      image_too_small: "This photo is too small. Choose a clearer image with the leaf filling more of the frame.",
      file_size: "That photo is too large. The maximum size is 4 MB.", request_timeout: "Analysis took too long. Check the connection and retry.",
      request_failed: "Could not connect to the analysis server. Check the connection and retry.",
      result_uncertain: "Not sure — please verify this possible match.", result_possible: "Possible model match — please verify before action.",
      result_mismatch: "Crop mismatch: this result is marked uncertain.",
      warn_field: "Real farm photos and unfamiliar conditions may be misclassified.",
      warn_score: "The model score is not a calibrated probability or a guarantee of correctness.",
      warn_verify: "This is a preliminary screen, not a diagnosis. Verify with a qualified agricultural advisor before any treatment decision.",
      warn_pesticide: "Do not choose or apply pesticides based only on this result.",
      warn_mismatch: "The selected crop and the model's top class differ. Confirm the crop; this does not prove the model identified it correctly.",
      warn_quality: "The photo may be too dark, bright or lacking visible detail. Consider taking another photo.",
      condition_label: "Possible model match", healthy_label: "Closest match: a healthy-leaf class",
      translate_note: "A reviewed translation is not available for this technical class name; the model's English class label is shown.",
      result_voice_missing: "No suitable speech voice is available for this language on this device. The written result is still available.",
      offline_retry: "The server is still unavailable. Diagnosis needs an internet connection.",
      close: "Close", speech_part_label: "Affected parts: "
    },
    hi: {
      locale: "hi-IN", dir: "ltr",
      language_label: "भाषा", home_link: "AI Crop Doctor होम", hero_eyebrow: "खेत-केंद्रित · मानव द्वारा पुष्टि",
      photo_input: "पत्ते की फोटो लें या चुनें", preview_alt: "चयनित पत्ते की फोटो का पूर्वावलोकन",
      footer_label: "AI CROP DOCTOR · स्कूल विज्ञान प्रदर्शनी",
      offline_message: "आप ऑफ़लाइन हैं। ऐप का इंटरफ़ेस और सहेजा इतिहास दिख सकता है, लेकिन फोटो जाँच के लिए सर्वर से संपर्क आवश्यक है।",
      retry: "फिर प्रयास करें", install_app: "ऐप इंस्टॉल करें", nav_diagnose: "जाँच", nav_learn: "यह कैसे काम करता है", nav_history: "इतिहास",
      nav_settings: "सेटिंग", main_sections: "मुख्य अनुभाग", settings_title: "भाषा और सुलभता",
      settings_language: "भाषा चयन इंटरफ़ेस, मार्गदर्शित प्रश्नों, सुरक्षा संदेशों और परिणाम पढ़ने की भाषा पर लागू होता है।",
      focus_language: "इंटरफ़ेस भाषा चुनें",
      retry_analysis: "जाँच फिर करें",
      settings_accessibility: "आवाज़ नियंत्रण वैकल्पिक हैं। माइक्रोफ़ोन केवल बटन दबाने पर चालू होता है; लिखना और फसल चुनना हमेशा उपलब्ध है। कीबोर्ड और उर्दू दाएँ-से-बाएँ पढ़ने का समर्थन है।",
      talk_me: "मुझे चरणों में बताइए", choose_gallery: "गैलरी से चुनें",
      photo_tip: "फोटो सुझाव: एक पत्ता, साफ़ फोकस और दिन का उजाला रखें; गहरी छाया से बचें। JPG, PNG या WEBP, अधिकतम 4 MB।",
      speech_privacy: "आवाज़ पहचान आपके ब्राउज़र पर निर्भर करती है और ऑडियो बाहरी सेवा को भेजा जा सकता है। यह ऑफ़लाइन काम न भी करे।",
      mic_consent: "क्या आप आवाज़ पहचान जारी रखना चाहते हैं?", upload_privacy: "फोटो जाँच के लिए सर्वर पर भेजी जाती है। सर्वर होस्ट इसे अस्थायी रूप से रख सकता है; ऐप केस रिकॉर्ड नहीं बनाता।",
      score_caveat: "कच्चा मॉडल स्कोर; सही होने की कैलिब्रेट की गई संभावना नहीं।",
      safety_reminder: "AI-सहायित प्रारंभिक फसल-स्वास्थ्य जाँच। यह पुष्ट निदान नहीं है; उपचार से पहले स्थानीय योग्य कृषि सलाहकार से पुष्टि करें।",
      learn_summary: "यह जाँच कैसे काम करती है और इसकी सीमाएँ",
      learn_model: "प्रकाशित छवि-मॉडल फोटो की तुलना समर्थित छवि वर्गों से करता है। बोला या लिखा गया नोट मॉडल की पहचान नहीं बदलता।",
      learn_score: "दिखाया गया स्कोर मॉडल का कच्चा स्कोर है, मापी गई संभावना नहीं। सीमा केवल एक सरल नियम है और स्थानीय खेत की तस्वीरों पर कैलिब्रेट नहीं की गई।",
      learn_limits: "मॉडल कार्ड में चुने हुए और छोटे खेत-जैसे नमूनों के परिणाम हैं; वे इस ऐप के परिणाम नहीं हैं। स्थानीय खेत की तस्वीरों पर इस ऐप का स्वतंत्र परीक्षण नहीं हुआ है।",
      learn_safety: "संभावित पहचान पक्का निदान नहीं है। केवल इस परिणाम के आधार पर कीटनाशक न चुनें या न लगाएँ। उपचार से पहले योग्य स्थानीय कृषि सलाहकार से पूछें।",
      history_label: "इसी डिवाइस पर", history_title: "हाल का इतिहास", history_intro: "इतिहास वैकल्पिक है और इसी ब्राउज़र में रहता है। फोटो कभी शामिल नहीं होती।",
      history_optin: "इस डिवाइस पर परिणाम सहेजें", history_off: "स्थानीय इतिहास बंद है। नए परिणाम सहेजे नहीं जाएँगे।",
      export_history: "JSON निर्यात", clear_history: "सब हटाएँ", history_saved: "केवल इस डिवाइस पर सहेजा गया। कोई फोटो सहेजी नहीं जाती।",
      history_empty: "अभी कोई परिणाम सहेजा नहीं गया है।", history_delete: "हटाएँ", history_confirm_clear: "इस डिवाइस से सभी सहेजे परिणाम हटाएँ?",
      history_deleted: "सहेजा इतिहास हटा दिया गया।", history_saved_toast: "परिणाम इस डिवाइस पर सहेजा गया।", history_unavailable: "इस ब्राउज़र में स्थानीय इतिहास उपलब्ध नहीं है।",
      export_empty: "निर्यात करने के लिए कोई सहेजा परिणाम नहीं है।", install_help: "फोन पर इंस्टॉल और उपयोग करें",
      android_help: "Android: HTTPS ऐप URL को Chrome में खोलें, फिर मेनू में Install app या Add to Home screen चुनें।",
      ios_help: "iPhone/iPad: HTTPS ऐप URL को Safari में खोलें, Share दबाएँ, फिर Add to Home Screen चुनें।",
      offline_help: "इंस्टॉल किया ऐप इंटरफ़ेस कैश कर सकता है, पर फोटो जाँच के लिए Flask मॉडल सर्वर से इंटरनेट कनेक्शन चाहिए। इंस्टॉल और माइक्रोफ़ोन के लिए सुरक्षित HTTPS आवश्यक है।",
      guided_label: "चरणबद्ध जानकारी", crop_label_short: "फसल चुनें", take_photo: "फोटो लें",
      speak_answer: "बोलकर बताएँ", replay_prompt: "प्रश्न फिर सुनें", skip: "छोड़ें", back: "पीछे", next: "आगे",
      step_crop: "यह कौन-सी फसल है? समर्थित फसल सूची से चुनें या पता नहीं विकल्प रहने दें।",
      step_symptom: "पत्ते पर क्या बदलाव या निशान दिखते हैं? बोलें, लिखें या इस प्रश्न को छोड़ें।",
      step_parts: "कौन-से पत्ते या पौधे के हिस्से प्रभावित हैं? यह वैकल्पिक नोट है और फोटो की पहचान नहीं बदलता।",
      step_photo: "एक पत्ते की साफ़ नज़दीकी फोटो लें या गैलरी से फोटो चुनें।",
      step_confirm: "सर्वर पर फोटो भेजने से पहले विवरण देखें और पुष्टि करें।",
      progress: "चरण {current} / {total}", prompt_replay: "यह प्रश्न फिर से नहीं सुना जा सका।",
      notes_label: "नोट",
      mic_unsupported: "इस ब्राउज़र में आवाज़ इनपुट समर्थित नहीं है। लिखें या फसल सूची चुनें।",
      mic_permission: "माइक्रोफ़ोन अनुमति नहीं मिली। ब्राउज़र अनुमति जाँचें या लिखकर जारी रखें।",
      mic_no_speech: "आवाज़ पहचान नहीं हुई। फिर कोशिश करें या लिखें।",
      mic_listening: "सुन रहा है… बोलें। समाप्त होने पर सुनना बंद करें दबाएँ।",
      mic_stop: "सुनना बंद करें", mic_idle: "बोलें", mic_added: "आवाज़ का नोट जोड़ा गया।",
      mic_transcribing: "आवाज़ लिखी जा रही है…", crop_not_matched: "फसल का नाम नहीं मिला। सूची से चुनें या नाम लिखें।",
      image_missing: "आगे बढ़ने से पहले पत्ते की फोटो चुनें।", file_type: "JPG, PNG या WEBP फोटो चुनें।",
      invalid_image: "चयनित फाइल फोटो के रूप में नहीं पढ़ी जा सकी। दूसरी JPG, PNG या WEBP फोटो चुनें।",
      image_too_small: "यह फोटो बहुत छोटी है। पत्ते को साफ़ और बड़ा दिखाने वाली फोटो चुनें।",
      file_size: "फोटो बहुत बड़ी है। अधिकतम आकार 4 MB है।", request_timeout: "जाँच में अधिक समय लगा। कनेक्शन जाँचकर फिर कोशिश करें।",
      request_failed: "जाँच सर्वर से संपर्क नहीं हो सका। कनेक्शन जाँचकर फिर कोशिश करें।",
      result_uncertain: "पक्का नहीं — इस संभावित पहचान की पुष्टि करें।", result_possible: "मॉडल की संभावित पहचान — कार्रवाई से पहले पुष्टि करें।",
      result_mismatch: "फसल मेल नहीं खाई: परिणाम को अनिश्चित माना गया है।",
      warn_field: "खेत की असली तस्वीरों या अनजान स्थितियों में मॉडल गलत पहचान कर सकता है।",
      warn_score: "मॉडल स्कोर कैलिब्रेट की गई संभावना या सही होने की गारंटी नहीं है।",
      warn_verify: "यह शुरुआती जाँच है, निदान नहीं। उपचार के निर्णय से पहले योग्य कृषि सलाहकार से पुष्टि करें।",
      warn_pesticide: "केवल इस परिणाम के आधार पर कीटनाशक न चुनें या न लगाएँ।",
      warn_mismatch: "चुनी गई फसल और मॉडल की पहचान अलग हैं। फसल की पुष्टि करें; इससे मॉडल की सही पहचान साबित नहीं होती।",
      warn_quality: "फोटो बहुत अँधेरी, उजली या कम विवरण वाली हो सकती है। दूसरी फोटो लेने पर विचार करें।",
      condition_label: "मॉडल की संभावित पहचान", healthy_label: "सबसे नज़दीकी पहचान: स्वस्थ पत्ते का वर्ग",
      translate_note: "इस तकनीकी वर्ग नाम का सत्यापित अनुवाद उपलब्ध नहीं है; मॉडल का अंग्रेज़ी नाम दिखाया गया है।",
      result_voice_missing: "इस डिवाइस पर इस भाषा के लिए उपयुक्त आवाज़ उपलब्ध नहीं है। लिखित परिणाम उपलब्ध है।",
      offline_retry: "सर्वर अभी उपलब्ध नहीं है। जाँच के लिए इंटरनेट कनेक्शन चाहिए।",
      close: "बंद करें", speech_part_label: "प्रभावित हिस्से: "
    },
    mr: {
      locale: "mr-IN", dir: "ltr",
      language_label: "भाषा", home_link: "AI Crop Doctor मुख्यपृष्ठ", hero_eyebrow: "शेतकेंद्रित · मानवी पडताळणी",
      photo_input: "पानाचा फोटो घ्या किंवा निवडा", preview_alt: "निवडलेल्या पानाच्या फोटोचे पूर्वदृश्य",
      footer_label: "AI CROP DOCTOR · शालेय विज्ञान प्रदर्शन",
      offline_message: "आपण ऑफलाइन आहात. अॅपचा इंटरफेस आणि जतन केलेला इतिहास दिसू शकतो; फोटो तपासण्यासाठी सर्व्हरशी जोडणी आवश्यक आहे.",
      retry: "पुन्हा प्रयत्न करा", install_app: "अॅप स्थापित करा", nav_diagnose: "तपासणी", nav_learn: "हे कसे कार्य करते", nav_history: "इतिहास",
      nav_settings: "सेटिंग्ज", main_sections: "मुख्य विभाग", settings_title: "भाषा आणि सुलभता",
      settings_language: "भाषा निवड इंटरफेस, मार्गदर्शित प्रश्न, सुरक्षितता सूचना आणि निकाल वाचण्याच्या भाषेला लागू होते.",
      focus_language: "इंटरफेसची भाषा निवडा",
      retry_analysis: "तपासणी पुन्हा करा",
      settings_accessibility: "आवाज नियंत्रण ऐच्छिक आहे. मायक्रोफोन फक्त बटण दाबल्यावर सुरू होतो; टाइप करणे आणि पीक निवडणे उपलब्ध आहे. कीबोर्ड आणि उर्दू उजवीकडून डावीकडे वाचन समर्थित आहे.",
      talk_me: "मला टप्प्याटप्प्याने सांगा", choose_gallery: "गॅलरीमधून निवडा",
      photo_tip: "फोटो टिप: एक पान, स्पष्ट फोकस आणि दिवसाचा प्रकाश; गडद सावली टाळा. JPG, PNG किंवा WEBP, कमाल 4 MB.",
      speech_privacy: "आवाज ओळख ब्राउझरवर अवलंबून आहे आणि ऑडिओ बाह्य सेवेकडे पाठवला जाऊ शकतो. ऑफलाइन काम होईलच असे नाही.",
      mic_consent: "आवाज ओळख सुरू ठेवायची?", upload_privacy: "फोटो तपासणीसाठी सर्व्हरकडे पाठवला जातो. सर्व्हर होस्ट तो तात्पुरता साठवू शकतो; अॅप केस नोंद तयार करत नाही.",
      score_caveat: "मॉडेलचा मूळ स्कोअर; योग्यतेची कॅलिब्रेट केलेली शक्यता नाही.",
      safety_reminder: "AI-सहाय्यित प्राथमिक पीक-आरोग्य तपासणी. हे निश्चित निदान नाही; उपचारापूर्वी स्थानिक पात्र कृषी सल्लागाराकडून खात्री करा.",
      learn_summary: "ही तपासणी कशी चालते आणि तिच्या मर्यादा",
      learn_model: "प्रकाशित प्रतिमा-वर्गीकरण मॉडेल फोटोची तुलना समर्थित प्रतिमा वर्गांशी करते. बोललेली किंवा लिहिलेली नोंद मॉडेलचा अंदाज बदलत नाही.",
      learn_score: "दाखवलेला स्कोअर हा मॉडेलचा मूळ स्कोअर आहे, मोजलेली शक्यता नाही. मर्यादा हा साधा नियम आहे; स्थानिक शेतातील फोटोंवर तो कॅलिब्रेट केलेला नाही.",
      learn_limits: "मॉडेल कार्डमध्ये निवडक आणि लहान शेत-सदृश नमुन्यांचे निकाल आहेत; ते या अॅपचे निकाल नाहीत. स्थानिक शेतातील फोटोंवर अॅपचे स्वतंत्र प्रमाणीकरण झालेले नाही.",
      learn_safety: "संभाव्य जुळणी म्हणजे निश्चित निदान नाही. फक्त या निकालावरून कीटकनाशक निवडू किंवा वापरू नका. उपचारापूर्वी पात्र स्थानिक कृषी सल्लागारांचा सल्ला घ्या.",
      history_label: "या डिव्हाइसवर", history_title: "अलीकडील इतिहास", history_intro: "इतिहास ऐच्छिक आहे आणि याच ब्राउझरमध्ये राहतो. फोटो कधीही समाविष्ट होत नाही.",
      history_optin: "निकाल या डिव्हाइसवर जतन करा", history_off: "स्थानिक इतिहास बंद आहे. नवीन निकाल जतन होणार नाहीत.",
      export_history: "JSON निर्यात", clear_history: "सर्व हटवा", history_saved: "फक्त या डिव्हाइसवर जतन. फोटो जतन केले जात नाहीत.",
      history_empty: "अजून कोणतेही निकाल जतन केलेले नाहीत.", history_delete: "हटवा", history_confirm_clear: "या डिव्हाइसवरील सर्व जतन केलेले निकाल हटवायचे?",
      history_deleted: "जतन केलेला इतिहास हटवला.", history_saved_toast: "निकाल या डिव्हाइसवर जतन केला.", history_unavailable: "या ब्राउझरमध्ये स्थानिक इतिहास उपलब्ध नाही.",
      export_empty: "निर्यात करण्यासाठी जतन केलेले निकाल नाहीत.", install_help: "फोनवर स्थापित करून वापरा",
      android_help: "Android: HTTPS अॅप URL Chrome मध्ये उघडा, नंतर ब्राउझर मेनूमधून Install app किंवा Add to Home screen निवडा.",
      ios_help: "iPhone/iPad: HTTPS अॅप URL Safari मध्ये उघडा, Share दाबा आणि Add to Home Screen निवडा.",
      offline_help: "स्थापित अॅप इंटरफेस कॅश करू शकतो, परंतु फोटो तपासणीसाठी Flask मॉडेल सर्व्हरशी इंटरनेट जोडणी आवश्यक आहे. स्थापना आणि मायक्रोफोनसाठी सुरक्षित HTTPS आवश्यक आहे.",
      guided_label: "मार्गदर्शित माहिती", crop_label_short: "पीक निवडा", take_photo: "फोटो घ्या",
      speak_answer: "बोलून सांगा", replay_prompt: "प्रश्न पुन्हा ऐका", skip: "वगळा", back: "मागे", next: "पुढे",
      step_crop: "हे कोणते पीक आहे? समर्थित पिकांच्या यादीतून निवडा किंवा माहीत नाही तसेच ठेवा.",
      step_symptom: "पानावर कोणते बदल किंवा खुणा दिसतात? बोला, टाइप करा किंवा हा प्रश्न वगळा.",
      step_parts: "कोणती पाने किंवा झाडाचे भाग प्रभावित आहेत? ही ऐच्छिक नोंद आहे आणि प्रतिमेचा अंदाज बदलणार नाही.",
      step_photo: "एका पानाचा स्पष्ट जवळचा फोटो घ्या किंवा गॅलरीमधून फोटो निवडा.",
      step_confirm: "फोटो सर्व्हरकडे पाठवण्यापूर्वी तपशील तपासा आणि पुष्टी करा.",
      progress: "टप्पा {current} / {total}", prompt_replay: "हा प्रश्न पुन्हा ऐकवता आला नाही.",
      notes_label: "नोंदी",
      mic_unsupported: "या ब्राउझरमध्ये आवाज इनपुट समर्थित नाही. टाइप करा किंवा पीक निवडा.",
      mic_permission: "मायक्रोफोनची परवानगी मिळाली नाही. ब्राउझर परवानग्या तपासा किंवा टाइप करून पुढे जा.",
      mic_no_speech: "आवाज ओळखता आला नाही. पुन्हा प्रयत्न करा किंवा टाइप करा.",
      mic_listening: "ऐकत आहे… बोला. पूर्ण झाल्यावर ऐकणे थांबवा दाबा.",
      mic_stop: "ऐकणे थांबवा", mic_idle: "बोला", mic_added: "आवाजाची नोंद जोडली.",
      mic_transcribing: "आवाजाचे मजकुरात रूपांतर सुरू आहे…", crop_not_matched: "पिकाचे नाव जुळले नाही. यादीतून निवडा किंवा टाइप करा.",
      image_missing: "पुढे जाण्यापूर्वी पानाचा फोटो निवडा.", file_type: "JPG, PNG किंवा WEBP प्रतिमा वापरा.",
      invalid_image: "निवडलेली फाइल प्रतिमा म्हणून वाचता आली नाही. दुसरा JPG, PNG किंवा WEBP फोटो निवडा.",
      image_too_small: "हा फोटो खूप लहान आहे. पान स्पष्ट आणि मोठे दिसेल असा फोटो निवडा.",
      file_size: "फोटो खूप मोठा आहे. कमाल आकार 4 MB आहे.", request_timeout: "तपासणीला जास्त वेळ लागला. जोडणी तपासून पुन्हा प्रयत्न करा.",
      request_failed: "तपासणी सर्व्हरशी जोडता आले नाही. जोडणी तपासून पुन्हा प्रयत्न करा.",
      result_uncertain: "खात्री नाही — या संभाव्य जुळणीची पडताळणी करा.", result_possible: "मॉडेलची संभाव्य जुळणी — कृतीपूर्वी पडताळणी करा.",
      result_mismatch: "पीक जुळत नाही: निकाल अनिश्चित आहे.",
      warn_field: "शेतातील खरे फोटो किंवा अपरिचित परिस्थितीत मॉडेल चुकीची ओळख करू शकते.",
      warn_score: "मॉडेल स्कोअर ही कॅलिब्रेट केलेली शक्यता किंवा अचूकतेची हमी नाही.",
      warn_verify: "ही प्राथमिक तपासणी आहे, निदान नाही. उपचाराच्या निर्णयापूर्वी पात्र कृषी सल्लागाराकडून पडताळणी करा.",
      warn_pesticide: "फक्त या निकालावरून कीटकनाशक निवडू किंवा वापरू नका.",
      warn_mismatch: "निवडलेले पीक आणि मॉडेलचा वर्ग वेगळा आहे. पिकाची खात्री करा; यावरून मॉडेलची ओळख योग्य ठरतेच असे नाही.",
      warn_quality: "फोटो खूप गडद, उजळ किंवा तपशील नसलेला असू शकतो. दुसरा फोटो घेण्याचा विचार करा.",
      condition_label: "मॉडेलची संभाव्य जुळणी", healthy_label: "जवळची जुळणी: निरोगी पानांचा वर्ग",
      translate_note: "या तांत्रिक वर्ग नावाचा तपासलेला अनुवाद उपलब्ध नाही; मॉडेलचे इंग्रजी नाव दाखवले आहे.",
      result_voice_missing: "या डिव्हाइसवर या भाषेसाठी योग्य आवाज उपलब्ध नाही. लिखित निकाल उपलब्ध आहे.",
      offline_retry: "सर्व्हर अजून उपलब्ध नाही. तपासणीसाठी इंटरनेट जोडणी आवश्यक आहे.",
      close: "बंद करा", speech_part_label: "प्रभावित भाग: "
    },
    ur: {
      locale: "ur-IN", dir: "rtl",
      language_label: "زبان", home_link: "AI Crop Doctor مرکزی صفحہ", hero_eyebrow: "کھیت پر مرکوز · انسانی تصدیق",
      photo_input: "پتے کی تصویر لیں یا منتخب کریں", preview_alt: "منتخب پتے کی تصویر کا پیش منظر",
      footer_label: "AI CROP DOCTOR · اسکول سائنس نمائش",
      offline_message: "آپ آف لائن ہیں۔ ایپ کا انٹرفیس اور محفوظ تاریخ دستیاب ہو سکتی ہے، لیکن تصویر کے تجزیے کے لیے سرور سے رابطہ ضروری ہے۔",
      retry: "دوبارہ کوشش", install_app: "ایپ انسٹال کریں", nav_diagnose: "جانچ", nav_learn: "یہ کیسے کام کرتا ہے", nav_history: "تاریخ",
      nav_settings: "ترتیبات", main_sections: "اہم حصے", settings_title: "زبان اور رسائی",
      settings_language: "زبان کا انتخاب انٹرفیس، رہنمائی کے سوالات، حفاظتی نوٹس اور نتیجہ سنانے پر لاگو ہوتا ہے۔",
      focus_language: "انٹرفیس کی زبان منتخب کریں",
      retry_analysis: "تجزیہ دوبارہ کریں",
      settings_accessibility: "آواز کے کنٹرول اختیاری ہیں۔ مائیکروفون صرف بٹن دبانے پر چلے گا؛ لکھنے اور فصل منتخب کرنے کے متبادل دستیاب ہیں۔ کی بورڈ اور اردو دائیں سے بائیں مطالعے کی معاونت ہے۔",
      talk_me: "مرحلہ وار رہنمائی", choose_gallery: "گیلری سے منتخب کریں",
      photo_tip: "تصویر کا مشورہ: ایک پتا، واضح فوکس اور دن کی روشنی؛ گہرے سائے سے بچیں۔ JPG، PNG یا WEBP، زیادہ سے زیادہ 4 MB۔",
      speech_privacy: "آواز کی شناخت براؤزر پر منحصر ہے اور آڈیو کسی بیرونی سروس کو بھیجا جا سکتا ہے۔ یہ آف لائن کام نہ بھی کرے۔",
      mic_consent: "آواز کی شناخت جاری رکھیں؟", upload_privacy: "تصویر تجزیے کے لیے سرور کو بھیجی جاتی ہے۔ سرور ہوسٹ اسے عارضی طور پر رکھ سکتا ہے؛ ایپ کیس ریکارڈ نہیں بناتی۔",
      score_caveat: "ماڈل کا خام اسکور؛ درست ہونے کا کیلیبریٹ شدہ امکان نہیں۔",
      safety_reminder: "AI کی مدد سے فصل کی صحت کی ابتدائی جانچ۔ یہ حتمی تشخیص نہیں؛ علاج سے پہلے مقامی اہل زرعی مشیر سے تصدیق کریں۔",
      learn_summary: "یہ جانچ کیسے کام کرتی ہے اور اس کی حدود",
      learn_model: "شائع شدہ تصویری ماڈل اپ لوڈ کی گئی تصویر کا موازنہ معاون تصویری زمروں سے کرتا ہے۔ بولی یا لکھی ہوئی بات ماڈل کی پیش گوئی نہیں بدلتی۔",
      learn_score: "دکھایا گیا اسکور ماڈل کا خام اسکور ہے، ناپا ہوا امکان نہیں۔ حد ایک سادہ اصول ہے اور مقامی کھیت کی تصاویر پر کیلیبریٹ نہیں کی گئی۔",
      learn_limits: "ماڈل کارڈ میں منتخب اور چھوٹے کھیت جیسے نمونوں کے نتائج ہیں؛ یہ اس ایپ کے نتائج نہیں۔ مقامی کھیت کی تصاویر پر ایپ کی آزادانہ توثیق نہیں ہوئی۔",
      learn_safety: "ممکنہ مماثلت حتمی تشخیص نہیں۔ صرف اس نتیجے پر کیڑے مار دوا منتخب یا استعمال نہ کریں۔ علاج سے پہلے اہل مقامی زرعی مشیر سے پوچھیں۔",
      history_label: "اسی آلے پر", history_title: "حالیہ تاریخ", history_intro: "تاریخ اختیاری ہے اور اسی براؤزر میں رہتی ہے۔ تصاویر کبھی شامل نہیں ہوتیں۔",
      history_optin: "نتائج اسی آلے پر محفوظ کریں", history_off: "مقامی تاریخ بند ہے۔ نئے نتائج محفوظ نہیں ہوں گے۔",
      export_history: "JSON برآمد", clear_history: "سب حذف کریں", history_saved: "صرف اسی آلے پر محفوظ۔ کوئی تصویر محفوظ نہیں ہوتی۔",
      history_empty: "ابھی کوئی نتیجہ محفوظ نہیں۔", history_delete: "حذف کریں", history_confirm_clear: "اس آلے سے تمام محفوظ نتائج حذف کریں؟",
      history_deleted: "محفوظ تاریخ حذف کر دی گئی۔", history_saved_toast: "نتیجہ اسی آلے پر محفوظ کیا گیا۔", history_unavailable: "اس براؤزر میں مقامی تاریخ دستیاب نہیں۔",
      export_empty: "برآمد کے لیے کوئی محفوظ نتیجہ نہیں۔", install_help: "فون پر انسٹال اور استعمال کریں",
      android_help: "Android: HTTPS ایپ URL کو Chrome میں کھولیں، پھر براؤزر مینو سے Install app یا Add to Home screen منتخب کریں۔",
      ios_help: "iPhone/iPad: HTTPS ایپ URL کو Safari میں کھولیں، Share دبائیں، پھر Add to Home Screen منتخب کریں۔",
      offline_help: "انسٹال شدہ ایپ انٹرفیس محفوظ کر سکتی ہے، لیکن تصویر کے تجزیے کے لیے Flask ماڈل سرور سے انٹرنیٹ رابطہ ضروری ہے۔ انسٹالیشن اور مائیکروفون کے لیے HTTPS درکار ہے۔",
      guided_label: "مرحلہ وار معلومات", crop_label_short: "فصل منتخب کریں", take_photo: "تصویر لیں",
      speak_answer: "بول کر جواب دیں", replay_prompt: "سوال دوبارہ سنیں", skip: "چھوڑیں", back: "واپس", next: "آگے",
      step_crop: "یہ کون سی فصل ہے؟ معاون فصلوں کی فہرست سے منتخب کریں یا معلوم نہیں رہنے دیں۔",
      step_symptom: "پتے پر کیا تبدیلی یا نشان نظر آتا ہے؟ بولیں، لکھیں یا اس سوال کو چھوڑ دیں۔",
      step_parts: "کون سے پتے یا پودے کے حصے متاثر ہیں؟ یہ اختیاری نوٹ ہے اور تصویر کی پیش گوئی نہیں بدلے گا۔",
      step_photo: "ایک پتے کی واضح قریبی تصویر لیں یا گیلری سے تصویر منتخب کریں۔",
      step_confirm: "تصویر سرور کو بھیجنے سے پہلے تفصیلات دیکھیں اور تصدیق کریں۔",
      progress: "مرحلہ {current} از {total}", prompt_replay: "یہ سوال دوبارہ نہیں سنایا جا سکا۔",
      notes_label: "نوٹس",
      mic_unsupported: "اس براؤزر میں آواز کا اندراج دستیاب نہیں۔ آپ لکھ سکتے یا فصل منتخب کر سکتے ہیں۔",
      mic_permission: "مائیکروفون کی اجازت نہیں ملی۔ براؤزر کی اجازت دیکھیں یا لکھ کر جاری رکھیں۔",
      mic_no_speech: "آواز شناخت نہیں ہوئی۔ دوبارہ کوشش کریں یا لکھیں۔",
      mic_listening: "سن رہا ہے… بولیں۔ مکمل ہونے پر سننا بند کریں دبائیں۔",
      mic_stop: "سننا بند کریں", mic_idle: "بولیں", mic_added: "آواز کا نوٹ شامل کیا گیا۔",
      mic_transcribing: "آواز تحریر میں بدل رہی ہے…", crop_not_matched: "فصل کا نام نہیں ملا۔ فہرست سے منتخب کریں یا لکھیں۔",
      image_missing: "آگے بڑھنے سے پہلے پتے کی تصویر منتخب کریں۔", file_type: "JPG، PNG یا WEBP تصویر منتخب کریں۔",
      invalid_image: "منتخب فائل تصویر کے طور پر نہیں پڑھی جا سکی۔ دوسری JPG، PNG یا WEBP تصویر منتخب کریں۔",
      image_too_small: "یہ تصویر بہت چھوٹی ہے۔ واضح تصویر منتخب کریں جس میں پتا بڑا نظر آئے۔",
      file_size: "تصویر بہت بڑی ہے۔ زیادہ سے زیادہ سائز 4 MB ہے۔", request_timeout: "تجزیے میں زیادہ وقت لگا۔ رابطہ دیکھ کر دوبارہ کوشش کریں۔",
      request_failed: "تجزیے کے سرور سے رابطہ نہیں ہو سکا۔ رابطہ دیکھ کر دوبارہ کوشش کریں۔",
      result_uncertain: "یقین نہیں — اس ممکنہ مماثلت کی تصدیق کریں۔", result_possible: "ماڈل کی ممکنہ مماثلت — عمل سے پہلے تصدیق کریں۔",
      result_mismatch: "فصل میں فرق: نتیجہ غیر یقینی ہے۔",
      warn_field: "کھیت کی حقیقی تصاویر یا نامانوس حالات میں ماڈل غلط درجہ بندی کر سکتا ہے۔",
      warn_score: "ماڈل اسکور کیلیبریٹ شدہ امکان یا درستگی کی ضمانت نہیں۔",
      warn_verify: "یہ ابتدائی جانچ ہے، تشخیص نہیں۔ علاج کے فیصلے سے پہلے اہل زرعی مشیر سے تصدیق کریں۔",
      warn_pesticide: "صرف اس نتیجے کی بنیاد پر کیڑے مار دوا منتخب یا استعمال نہ کریں۔",
      warn_mismatch: "منتخب فصل اور ماڈل کا زمرہ مختلف ہے۔ فصل کی تصدیق کریں؛ اس سے ماڈل کی درست شناخت ثابت نہیں ہوتی۔",
      warn_quality: "تصویر بہت تاریک، روشن یا کم تفصیل والی ہو سکتی ہے۔ دوسری تصویر لینے پر غور کریں۔",
      condition_label: "ماڈل کی ممکنہ مماثلت", healthy_label: "قریب ترین مماثلت: صحت مند پتے کا زمرہ",
      translate_note: "اس تکنیکی زمرے کا جانچا ہوا ترجمہ دستیاب نہیں؛ ماڈل کا انگریزی نام دکھایا گیا ہے۔",
      result_voice_missing: "اس آلے پر اس زبان کے لیے موزوں آواز دستیاب نہیں۔ تحریری نتیجہ موجود ہے۔",
      offline_retry: "سرور ابھی دستیاب نہیں۔ جانچ کے لیے انٹرنیٹ رابطہ ضروری ہے۔",
      close: "بند کریں", speech_part_label: "متاثرہ حصے: "
    }
  };

  let CLASS_LABELS = {};

  const CROPS = {
    en: {Apple:"Apple",Blueberry:"Blueberry",Cherry:"Cherry",Corn:"Corn",Grape:"Grape",Orange:"Orange",Peach:"Peach","Bell pepper":"Bell pepper",Potato:"Potato",Raspberry:"Raspberry",Soybean:"Soybean",Squash:"Squash",Strawberry:"Strawberry",Tomato:"Tomato"},
    hi: {Apple:"सेब",Blueberry:"ब्लूबेरी",Cherry:"चेरी",Corn:"मक्का",Grape:"अंगूर",Orange:"संतरा",Peach:"आड़ू","Bell pepper":"शिमला मिर्च",Potato:"आलू",Raspberry:"रास्पबेरी",Soybean:"सोयाबीन",Squash:"स्क्वैश",Strawberry:"स्ट्रॉबेरी",Tomato:"टमाटर"},
    mr: {Apple:"सफरचंद",Blueberry:"ब्लूबेरी",Cherry:"चेरी",Corn:"मका",Grape:"द्राक्ष",Orange:"संत्रे",Peach:"पीच","Bell pepper":"ढोबळी मिरची",Potato:"बटाटा",Raspberry:"रास्पबेरी",Soybean:"सोयाबीन",Squash:"स्क्वॅश",Strawberry:"स्ट्रॉबेरी",Tomato:"टोमॅटो"},
    ur: {Apple:"سیب",Blueberry:"بلیو بیری",Cherry:"چیری",Corn:"مکئی",Grape:"انگور",Orange:"سنگترہ",Peach:"آڑو","Bell pepper":"شملہ مرچ",Potato:"آلو",Raspberry:"راسبیری",Soybean:"سویا بین",Squash:"اسکواش",Strawberry:"اسٹرابیری",Tomato:"ٹماٹر"}
  };
  const CONDITIONS = {
    "healthy": {hi:"स्वस्थ पत्ता वर्ग",mr:"निरोगी पानांचा वर्ग",ur:"صحت مند پتے کی کلاس"},
    "early blight": {hi:"अर्ली ब्लाइट (पत्तों पर धब्बे)",mr:"अर्ली ब्लाइट (पानांवरील डाग)",ur:"ابتدائی جھلساؤ"},
    "late blight": {hi:"लेट ब्लाइट",mr:"लेट ब्लाइट",ur:"لیٹ بلائٹ"},
    "bacterial spot": {hi:"बैक्टीरियल स्पॉट",mr:"बॅक्टेरियल स्पॉट",ur:"بیکٹیریل دھبے"},
    "leaf mold": {hi:"लीफ मोल्ड",mr:"लीफ मोल्ड",ur:"لیف مولڈ"},
    "septoria leaf spot": {hi:"सेप्टोरिया लीफ स्पॉट",mr:"सेप्टोरिया लीफ स्पॉट",ur:"سیپٹورिया لیف اسپاٹ"},
    "common rust": {hi:"कॉमन रस्ट",mr:"कॉमन रस्ट",ur:"کامن رسٹ"},
    "powdery mildew": {hi:"पाउडरी मिल्ड्यू",mr:"पावडरी मिल्ड्यू",ur:"پاؤڈری ملڈیو"},
    "tomato yellow leaf curl virus": {hi:"टमाटर येलो लीफ कर्ल वायरस",mr:"टोमॅटो यलो लीफ कर्ल व्हायरस",ur:"ٹماٹر یلو لیف کرل وائرس"},
    "tomato mosaic virus": {hi:"टमाटर मोज़ेक वायरस",mr:"टोमॅटो मोझॅक व्हायरस",ur:"ٹماٹر موزیک وائرس"},
    "black rot": {hi:"ब्लैक रॉट",mr:"ब्लॅक रॉट",ur:"بلیک روٹ"},
    "apple scab": {hi:"एप्पल स्कैब",mr:"अॅपल स्कॅब",ur:"ایپل اسکیب"}
  };

  const LANG = document.getElementById("language");
  const GUIDE = document.getElementById("guide-dialog");
  const FILE = document.getElementById("image-input");
  const GALLERY = document.getElementById("gallery-input");
  const MAX_BYTES = 4 * 1024 * 1024;
  let currentLanguage = LANG?.value || "en";
  let step = 0;
  let affectedParts = "";
  let recognition = null;
  let historyDb = null;
  let historyEnabled = false;
  let lastPrediction = null;

  const $ = (id) => document.getElementById(id);
  try { historyEnabled = window.localStorage.getItem("crop-doctor-history-enabled") === "true"; }
  catch (error) { console.warn("Could not read the local-history preference.", error); }
  const copy = () => COPY[currentLanguage] || COPY.en;
  const tr = (key) => copy()[key] || COPY.en[key] || key;
  const ERROR_TRANSLATIONS = {
    missing_file: "image_missing", invalid_image: "invalid_image", unsupported_image_format: "file_type",
    image_too_small: "image_too_small", image_dimensions_too_large: "file_size",
    file_too_large: "file_size", model_unavailable: "request_failed",
    empty_prediction: "request_failed", invalid_prediction: "request_failed", internal_error: "request_failed"
  };
  window.cropDoctorErrorText = (code) => tr(ERROR_TRANSLATIONS[code] || "request_failed");
  const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  const announce = (message) => {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 4200);
  };

  function applyExtraTranslations() {
    document.documentElement.lang = copy().locale;
    document.documentElement.dir = copy().dir;
    document.body.dir = copy().dir;
    document.querySelectorAll("[data-extra]").forEach((node) => {
      const key = node.dataset.extra;
      if (COPY[currentLanguage][key] || COPY.en[key]) node.textContent = tr(key);
    });
    document.querySelectorAll("[data-extra-aria]").forEach((node) => {
      node.setAttribute("aria-label", tr(node.dataset.extraAria));
    });
    document.querySelectorAll("[data-extra-alt]").forEach((node) => {
      node.setAttribute("alt", tr(node.dataset.extraAlt));
    });
    ["crop", "guide-crop"].forEach((id) => {
      const select = $(id);
      [...select.options].forEach((option) => {
        if (option.value !== "auto") {
          const canonical = option.value === "Pepper" ? "Bell pepper" : option.value;
          option.textContent = CROPS[currentLanguage]?.[canonical] || canonical;
        }
      });
    });
    $("close-guide").setAttribute("aria-label", tr("close"));
    if (lastPrediction) renderClassLabels(lastPrediction);
    if (step >= 0 && GUIDE.open) renderGuideStep();
    renderHistory();
  }

  LANG?.addEventListener("change", () => {
    currentLanguage = LANG.value;
    if (recognition) recognition.stop();
    applyExtraTranslations();
  });

  function updateNetworkState() {
    $("connection-banner").hidden = navigator.onLine;
  }
  window.addEventListener("online", updateNetworkState);
  window.addEventListener("offline", updateNetworkState);
  updateNetworkState();
  $("retry-connection").addEventListener("click", async () => {
    try {
      const response = await fetch("/api/health", {cache: "no-store"});
      if (!response.ok) throw new Error("Not ready");
      updateNetworkState();
    } catch {
      announce(tr("offline_retry"));
    }
  });

  function validateFile(file) {
    if (!file) return false;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      announce(tr("file_type"));
      FILE.value = "";
      return false;
    }
    if (file.size > MAX_BYTES) {
      announce(tr("file_size"));
      FILE.value = "";
      return false;
    }
    return true;
  }

  function useGalleryFile() {
    const file = GALLERY.files?.[0];
    if (!validateFile(file)) return;
    try {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      FILE.files = transfer.files;
      FILE.dispatchEvent(new Event("change", {bubbles: true}));
    } catch (error) {
      console.error("Could not transfer the selected gallery photo.", error);
      announce(tr("file_type"));
    }
    GALLERY.value = "";
  }
  $("gallery-button").addEventListener("click", () => GALLERY.click());
  GALLERY.addEventListener("change", useGalleryFile);
  $("guide-gallery").addEventListener("click", () => GALLERY.click());
  $("guide-camera").addEventListener("click", () => FILE.click());
  FILE.addEventListener("change", () => {
    const file = FILE.files?.[0];
    if (file && !validateFile(file)) {
      if ($("image-preview").src.startsWith("blob:")) URL.revokeObjectURL($("image-preview").src);
      FILE.value = "";
      $("image-preview").hidden = true;
      $("upload-empty").hidden = false;
      $("preview-overlay").hidden = true;
      return;
    }
  });

  const form = $("diagnosis-form");
  form.addEventListener("submit", () => {
    $("retry-analysis").hidden = true;
    if (window.matchMedia("(max-width: 950px)").matches) {
      window.setTimeout(() => $("loading-result").scrollIntoView({behavior: "smooth", block: "center"}), 0);
    }
  });
  $("retry-analysis").addEventListener("click", () => {
    if (!FILE.files?.[0]) {
      announce(tr("image_missing"));
      return;
    }
    form.requestSubmit();
  });
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    if (!url.includes("/api/diagnose")) return nativeFetch(input, init);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 170000);
    return nativeFetch(input, {...init, signal: controller.signal}).then(async (response) => {
      window.clearTimeout(timer);
      let payload;
      try { payload = await response.clone().json(); } catch (error) {
        console.error("Could not read analysis response.", error);
      }
      if (payload && response.ok) {
        lastPrediction = payload;
        window.dispatchEvent(new CustomEvent("crop-doctor:result", {detail: payload}));
        window.setTimeout(() => renderClassLabels(payload), 0);
      } else if (payload) {
        window.dispatchEvent(new CustomEvent("crop-doctor:error", {detail: payload}));
      }
      return response;
    }).catch((error) => {
      window.clearTimeout(timer);
      if (error.name === "AbortError") {
        announce(tr("request_timeout"));
      } else if (!navigator.onLine || error instanceof TypeError) {
        announce(tr("request_failed"));
      }
      window.setTimeout(() => {
        const errorBox = $("error-result");
        if (!errorBox.hidden) {
          errorBox.textContent = tr(error.name === "AbortError" ? "request_timeout" : "request_failed");
          $("retry-analysis").hidden = !FILE.files?.[0];
        }
      }, 20);
      throw error;
    });
  };

  function stopRecognition() {
    if (!recognition) return;
    try { recognition.stop(); } catch (error) { console.debug("Speech recognition was already stopped.", error); }
    recognition = null;
  }
  function startRecognition(button, onTranscript) {
    if (recognition) {
      stopRecognition();
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      announce(tr("mic_unsupported"));
      return;
    }
    if (!window.confirm(`${tr("speech_privacy")}\n\n${tr("mic_consent")}`)) return;
    const instance = new Recognition();
    recognition = instance;
    instance.lang = copy().locale;
    instance.interimResults = true;
    instance.continuous = false;
    instance.maxAlternatives = 1;
    button.setAttribute("aria-pressed", "true");
    button.classList.add("recording");
    const buttonText = button.querySelector("[data-extra], [data-i18n='speak']");
    if (buttonText) buttonText.textContent = tr("mic_stop");
    $("guide-feedback").textContent = tr("mic_listening");
    $("mic-status").textContent = button.id === "mic-button" ? tr("mic_listening") : "";
    let hadResult = false;
    instance.onresult = (event) => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      if (transcript) {
        hadResult = true;
        onTranscript(transcript.trim());
      }
    };
    instance.onerror = (event) => {
      const message = event.error === "not-allowed" || event.error === "service-not-allowed" ? tr("mic_permission") : tr("mic_no_speech");
      announce(message);
      if (button.id === "mic-button") $("mic-status").textContent = message;
    };
    instance.onend = () => {
      button.setAttribute("aria-pressed", "false");
      button.classList.remove("recording");
      if (buttonText) buttonText.textContent = button.id === "mic-button" ? tr("mic_idle") : tr("speak_answer");
      $("guide-feedback").textContent = hadResult ? tr("mic_added") : tr("mic_no_speech");
      if (button.id === "mic-button") $("mic-status").textContent = hadResult ? tr("mic_added") : tr("mic_no_speech");
      if (recognition === instance) recognition = null;
    };
    try { instance.start(); }
    catch (error) {
      console.error("Could not start speech recognition.", error);
      recognition = null;
      button.classList.remove("recording");
      button.setAttribute("aria-pressed", "false");
      announce(tr("mic_permission"));
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("#mic-button, #guide-mic");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (button.id === "guide-mic") {
      if (step === 0) {
        startRecognition(button, (text) => {
          const matchedCrop = matchCropName(text);
          if (matchedCrop) {
            $("guide-crop").value = matchedCrop;
            $("guide-feedback").textContent = $("guide-crop").selectedOptions[0].textContent;
          } else {
            $("guide-answer").value = text;
            $("guide-feedback").textContent = tr("crop_not_matched");
          }
        });
      } else {
        const original = $("guide-answer").value;
        startRecognition(button, (text) => {
          const answer = $("guide-answer");
          answer.value = `${original} ${text}`.trim();
          answer.setAttribute("aria-label", tr(step === 1 ? "step_symptom" : "step_parts"));
        });
      }
    } else {
      const original = $("symptoms").value;
      startRecognition(button, (text) => {
        const symptoms = $("symptoms");
        symptoms.value = `${original} ${text}`.trim();
      });
    }
  }, true);

  function speak(text, language = currentLanguage) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      announce(tr("result_voice_missing"));
      return;
    }
    const locale = COPY[language]?.locale || COPY.en.locale;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang.toLowerCase() === locale.toLowerCase())
      || voices.find((item) => item.lang.toLowerCase().startsWith(language));
    if (!voice) {
      announce(tr("result_voice_missing"));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.voice = voice;
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  $("read-result").addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    const label = $("diagnosis-label").textContent;
    const guidance = [...$("guidance-steps").querySelectorAll("li")].map((item) => item.textContent).join(". ");
    const warning = lastPrediction?.status === "uncertain" ? tr("result_uncertain") : tr("result_possible");
    speak(`${label}. ${warning}. ${guidance}. ${tr("safety_reminder")}`);
  }, true);

  const steps = ["crop", "symptom", "parts", "photo", "confirm"];
  $("guide-crop").innerHTML = $("crop").innerHTML;
  $("start-guide").addEventListener("click", () => {
    step = 0;
    $("guide-answer").value = "";
    $("guide-feedback").textContent = "";
    if (typeof GUIDE.showModal === "function") GUIDE.showModal();
    else GUIDE.setAttribute("open", "");
    renderGuideStep();
  });
  $("close-guide").addEventListener("click", () => GUIDE.close());
  GUIDE.addEventListener("close", stopRecognition);
  document.querySelectorAll(".section-nav a").forEach((link) => link.addEventListener("click", stopRecognition));
  window.addEventListener("pagehide", stopRecognition);

  function renderGuideStep() {
    const key = steps[step];
    $("guide-progress").textContent = fill(tr("progress"), {current: step + 1, total: steps.length});
    $("guide-prompt").textContent = tr(`step_${key}`);
    $("guide-answer").hidden = !["crop", "symptom", "parts"].includes(key);
    $("guide-crop-wrap").hidden = key !== "crop";
    $("guide-photo-actions").hidden = key !== "photo";
    $("guide-confirm").hidden = key !== "confirm";
    $("guide-mic").hidden = key === "photo" || key === "confirm";
    $("guide-skip").hidden = key === "confirm";
    $("guide-back").hidden = step === 0;
    $("guide-next").textContent = key === "confirm" ? tr("analyse") : tr("next");
    $("guide-answer").placeholder = key === "symptom" ? tr("step_symptom") : tr("step_parts");
    $("guide-answer").value = key === "symptom" ? $("symptoms").value : key === "parts" ? affectedParts : "";
    if (key === "crop") $("guide-crop").value = $("crop").value;
    if (key === "confirm") {
      const selected = $("crop").value === "auto" ? tr("crop_auto") : $("crop").selectedOptions[0].textContent;
      const photo = FILE.files?.[0]?.name || tr("image_missing");
      $("guide-confirm").textContent = `${tr("crop_label_short")}: ${selected}. ${tr("notes_label")}: ${$("symptoms").value || "—"}. ${photo}. ${tr("upload_privacy")}`;
      $("guide-next").disabled = !FILE.files?.[0];
    } else {
      $("guide-next").disabled = false;
    }
  }

  function commitStep() {
    const key = steps[step];
    if (key === "crop") {
      if ($("guide-answer").value.trim()) {
        const value = matchCropName($("guide-answer").value.trim());
        if (!value) {
          $("guide-feedback").textContent = tr("crop_not_matched");
          return false;
        }
        $("guide-crop").value = value;
      }
      $("crop").value = $("guide-crop").value;
    } else if (key === "symptom") {
      $("symptoms").value = $("guide-answer").value.trim();
    } else if (key === "parts") {
      affectedParts = $("guide-answer").value.trim();
    }
    return true;
  }

  $("guide-next").addEventListener("click", () => {
    if (step === steps.length - 1) {
      if (!FILE.files?.[0]) {
        $("guide-feedback").textContent = tr("image_missing");
        return;
      }
      GUIDE.close();
      if (affectedParts) $("symptoms").value = [$("symptoms").value, `${tr("speech_part_label")}${affectedParts}`].filter(Boolean).join("\n");
      form.requestSubmit();
      return;
    }
    if (!commitStep()) return;
    step += 1;
    $("guide-feedback").textContent = "";
    renderGuideStep();
  });
  $("guide-back").addEventListener("click", () => {
    if (step > 0) {
      commitStep();
      step -= 1;
      renderGuideStep();
    }
  });
  $("guide-skip").addEventListener("click", () => {
    if (steps[step] === "crop") $("guide-crop").value = "auto";
    if (steps[step] === "symptom") $("guide-answer").value = "";
    if (steps[step] === "parts") $("guide-answer").value = "";
    if (steps[step] === "crop") $("crop").value = "auto";
    if (steps[step] === "symptom") $("symptoms").value = "";
    if (steps[step] === "parts") affectedParts = "";
    if (step < steps.length - 1) step += 1;
    renderGuideStep();
  });
  $("guide-replay").addEventListener("click", () => speak(tr(`step_${steps[step]}`)));

  function matchCropName(text) {
    const normalised = text.toLocaleLowerCase().trim();
    for (const [crop, translated] of Object.entries(CROPS[currentLanguage] || CROPS.en)) {
      if (normalised.includes(crop.toLocaleLowerCase()) || normalised.includes(translated.toLocaleLowerCase())) {
        return crop === "Bell pepper" ? "Pepper" : crop;
      }
    }
    return null;
  }

  function translatedClass(rawLabel, englishLabel) {
    const entry = CLASS_LABELS[rawLabel];
    if (!entry) return {label: englishLabel, translated: false};
    const {crop, condition} = entry;
    const cropName = CROPS[currentLanguage]?.[crop] || crop;
    const conditionName = CONDITIONS[condition.toLowerCase()]?.[currentLanguage] || condition;
    return {
      label: `${cropName} — ${conditionName}`,
      translated: currentLanguage === "en" || (!!CROPS[currentLanguage]?.[crop] && !!CONDITIONS[condition.toLowerCase()]?.[currentLanguage])
    };
  }
  function renderClassLabels(data) {
    if (!data) return;
    const primary = translatedClass(data.raw_label, data.display_label || data.label);
    $("diagnosis-label").textContent = primary.label;
    $("diagnosis-detail").textContent = primary.translated ? primary.label : tr("translate_note");
    const rows = $("alternatives").querySelectorAll(".alternative");
    (data.alternatives || []).forEach((item, index) => {
      const row = rows[index];
      const name = row?.querySelector("span");
      if (!name) return;
      name.textContent = translatedClass(item.raw_label, item.label).label;
    });
    $("status-banner").textContent = data.crop_mismatch ? tr("result_mismatch")
      : data.status === "uncertain" ? tr("result_uncertain") : tr("result_possible");
    $("guidance-title").textContent = tr(data.status === "uncertain" ? "result_uncertain" : data.raw_label?.toLowerCase().includes("healthy") ? "healthy_label" : "condition_label");
    const warningKeys = ["warn_field", "warn_score", "warn_verify", "warn_pesticide"];
    if (data.crop_mismatch) warningKeys.unshift("warn_mismatch");
    if (data.uncertainty_reasons?.some((reason) => reason.startsWith("poor_") || reason === "low_image_detail")) warningKeys.unshift("warn_quality");
    $("warnings").replaceChildren(...warningKeys.map((key) => {
      const line = document.createElement("div");
      line.textContent = `• ${tr(key)}`;
      return line;
    }));
  }
  window.addEventListener("crop-doctor:result", (event) => {
    lastPrediction = event.detail;
    renderClassLabels(lastPrediction);
    if (historyEnabled) saveHistory(lastPrediction).catch((error) => {
      console.error("Could not save local history.", error);
      announce(tr("history_unavailable"));
    });
  });
  window.addEventListener("crop-doctor:error", (event) => {
    const message = window.cropDoctorErrorText(event.detail?.code);
    announce(message);
    window.setTimeout(() => {
      if (!$("error-result").hidden) {
        $("error-result").textContent = message;
        $("retry-analysis").hidden = !FILE.files?.[0];
      }
    }, 20);
  });

  fetch("/model-labels.json").then((response) => {
    if (!response.ok) throw new Error(`Could not load exact model class labels (${response.status}).`);
    return response.json();
  }).then((data) => {
    CLASS_LABELS = data.classes;
    if (lastPrediction) renderClassLabels(lastPrediction);
  }).catch((error) => {
    console.error("Could not load model class labels.", error);
    announce(tr("translate_note"));
  });

  async function openHistory() {
    if (!("indexedDB" in window)) throw new Error("IndexedDB is not available.");
    if (historyDb) return historyDb;
    historyDb = await new Promise((resolve, reject) => {
      const request = indexedDB.open("ai-crop-doctor-history", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("results")) db.createObjectStore("results", {keyPath: "id"});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open local history."));
    });
    return historyDb;
  }
  async function readHistory() {
    const db = await openHistory();
    return new Promise((resolve, reject) => {
      const request = db.transaction("results", "readonly").objectStore("results").getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
      request.onerror = () => reject(request.error || new Error("Could not read local history."));
    });
  }
  async function saveHistory(result) {
    const db = await openHistory();
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      timestamp: result.timestamp || new Date().toISOString(),
      crop: $("crop").value,
      label: result.display_label || result.label,
      raw_label: result.raw_label,
      score: result.score,
      uncertain: result.status === "uncertain",
      model_id: result.model_id,
      model_revision: result.model_revision
    };
    await new Promise((resolve, reject) => {
      const request = db.transaction("results", "readwrite").objectStore("results").add(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error("Could not save local history."));
    });
    await renderHistory();
    announce(tr("history_saved_toast"));
  }
  async function deleteHistory(id) {
    const db = await openHistory();
    await new Promise((resolve, reject) => {
      const request = db.transaction("results", "readwrite").objectStore("results").delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error("Could not delete local history."));
    });
    await renderHistory();
  }
  async function renderHistory() {
    const controls = $("history-controls");
    if (!controls) return;
    controls.hidden = !historyEnabled;
    if (!historyEnabled) return;
    const list = $("history-list");
    try {
      const entries = await readHistory();
      list.replaceChildren();
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "history-empty";
        empty.textContent = tr("history_empty");
        list.append(empty);
        return;
      }
      entries.forEach((entry) => {
        const row = document.createElement("article");
        row.className = "history-entry";
        const main = document.createElement("div");
        main.className = "history-entry-main";
        const title = document.createElement("strong");
        const titleBidi = document.createElement("bdi");
        titleBidi.textContent = translatedClass(entry.raw_label, entry.label).label;
        title.append(titleBidi);
        const detail = document.createElement("span");
        detail.textContent = `${new Date(entry.timestamp).toLocaleString(copy().locale)} · ${entry.score}% · ${entry.uncertain ? tr("result_uncertain") : tr("result_possible")}`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "secondary-button danger-button";
        remove.dataset.deleteId = entry.id;
        remove.textContent = tr("history_delete");
        remove.addEventListener("click", () => deleteHistory(entry.id).catch((error) => {
          console.error("Could not delete local history.", error);
          announce(tr("history_unavailable"));
        }));
        main.append(title, detail);
        row.append(main, remove);
        list.append(row);
      });
    } catch (error) {
      console.error("Could not load local history.", error);
      announce(tr("history_unavailable"));
    }
  }

  $("history-opt-in")?.addEventListener("change", async (event) => {
    historyEnabled = event.target.checked;
    try { window.localStorage.setItem("crop-doctor-history-enabled", historyEnabled ? "true" : "false"); }
    catch (error) { console.warn("Could not persist the local-history preference.", error); }
    if (historyEnabled) {
      try { await openHistory(); } catch (error) {
        console.error("Could not enable local history.", error);
        historyEnabled = false;
        event.target.checked = false;
        announce(tr("history_unavailable"));
      }
    }
    applyExtraTranslations();
  });
  $("export-history")?.addEventListener("click", async () => {
    try {
      const entries = await readHistory();
      if (!entries.length) {
        announce(tr("export_empty"));
        return;
      }
      const blob = new Blob([JSON.stringify(entries, null, 2)], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ai-crop-doctor-history.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Could not export local history.", error);
      announce(tr("history_unavailable"));
    }
  });
  $("clear-history")?.addEventListener("click", async () => {
    if (!window.confirm(tr("history_confirm_clear"))) return;
    try {
      const db = await openHistory();
      await new Promise((resolve, reject) => {
        const request = db.transaction("results", "readwrite").objectStore("results").clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("Could not clear local history."));
      });
      await renderHistory();
      announce(tr("history_deleted"));
    } catch (error) {
      console.error("Could not clear local history.", error);
      announce(tr("history_unavailable"));
    }
  });

  applyExtraTranslations();
})();
