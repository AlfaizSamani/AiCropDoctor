(() => {
  "use strict";

  const LANGUAGE_KEY = "crop-doctor-language";
  const HISTORY_KEY = "crop-doctor-history-enabled";
  const TUTORIAL_KEY = "crop-doctor-tutorial-complete";
  const SIDEBAR_KEY = "crop-doctor-sidebar-collapsed";
  const $ = (id) => document.getElementById(id);
  let translations = null;
  let language = "en";
  let tutorialStep = 0;
  let tutorialReturnFocus = null;
  let tutorialSeenThisVisit = false;
  let historyDb = null;
  let toastTimer = 0;

  function readSetting(key) {
    try { return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key); }
    catch (error) {
      console.warn(`Browser storage is unavailable for ${key}.`, error);
      try { return window.sessionStorage.getItem(key); }
      catch (sessionError) {
        console.warn(`Session storage is unavailable for ${key}.`, sessionError);
        return null;
      }
    }
  }

  function saveSetting(key, value) {
    try { window.localStorage.setItem(key, value); return true; }
    catch (error) {
      console.warn(`Could not save the browser setting ${key}.`, error);
      try { window.sessionStorage.setItem(key, value); return true; }
      catch (sessionError) {
        console.warn(`Could not save the session setting ${key}.`, sessionError);
        return false;
      }
    }
  }

  function text(key) {
    const entry = translations?.[language];
    if (!entry || !Object.prototype.hasOwnProperty.call(entry, key)) {
      throw new Error(`Missing reviewed ${language} UI translation: ${key}`);
    }
    return entry[key];
  }

  function toast(message) {
    const element = $("toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => element.classList.remove("show"), 3800);
  }

  language = readSetting(LANGUAGE_KEY) || $("language")?.value || "en";
  if (!["en", "hi", "mr", "ur"].includes(language)) language = "en";
  if ($("language")) $("language").value = language;
  if ($("settings-language")) $("settings-language").value = language;
  function applyLanguage() {
    const langSelect = $("language");
    const settingsSelect = $("settings-language");
    if (langSelect) langSelect.value = language;
    if (settingsSelect) settingsSelect.value = language;
    if (!translations) return;
    const page = translations[language];
    document.documentElement.lang = page.locale || ({en: "en-IN", hi: "hi-IN", mr: "mr-IN", ur: "ur-PK"}[language]);
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    document.body.dir = document.documentElement.dir;
    document.querySelectorAll("[data-site-i18n]").forEach((node) => {
      node.textContent = text(node.dataset.siteI18n);
    });
    document.querySelectorAll("[data-site-aria]").forEach((node) => {
      node.setAttribute("aria-label", text(node.dataset.siteAria));
    });
    document.querySelectorAll("[data-site-alt]").forEach((node) => {
      node.alt = text(node.dataset.siteAlt);
    });
    const menu = $("menu-toggle");
    if (menu) {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-label", text(open ? "menu_close" : "menu_open"));
    }
    document.title = `${document.querySelector(".page-header h1")?.textContent || text("nav_dashboard")} — AI Crop Doctor`;
    renderTutorial();
    renderLocalHistory();
    renderDashboardHistory();
  }

  async function loadTranslations() {
    const url = document.documentElement.dataset.translationsUrl;
    const response = await fetch(url, {cache: "no-cache"});
    if (!response.ok) throw new Error(`Could not load UI translations (${response.status}).`);
    translations = await response.json();
    language = readSetting(LANGUAGE_KEY) || $("language")?.value || "en";
    if (!Object.prototype.hasOwnProperty.call(translations, language)) language = "en";
    applyLanguage();
    if (readSetting(TUTORIAL_KEY) !== "true" && !tutorialSeenThisVisit) {
      window.setTimeout(() => openTutorial(false), 250);
    }
  }

  function setLanguage(value) {
    if (!["en", "hi", "mr", "ur"].includes(value)) return;
    language = value;
    saveSetting(LANGUAGE_KEY, value);
    applyLanguage();
    window.dispatchEvent(new CustomEvent("crop-doctor:language", {detail: {language}}));
  }

  $("language")?.addEventListener("change", (event) => setLanguage(event.currentTarget.value));
  $("settings-language")?.addEventListener("change", (event) => setLanguage(event.currentTarget.value));
  window.addEventListener("storage", (event) => {
    if (event.key === LANGUAGE_KEY && event.newValue && ["en", "hi", "mr", "ur"].includes(event.newValue)) {
      language = event.newValue;
      applyLanguage();
    }
  });

  const sidebar = $("app-sidebar");
  const menuButton = $("menu-toggle");
  const backdrop = $("sidebar-backdrop");
  function isMobileNavigation() { return window.matchMedia("(max-width: 860px)").matches; }
  function closeNavigation(returnFocus = false) {
    if (!sidebar || !menuButton) return;
    sidebar.classList.remove("drawer-open");
    document.body.classList.remove("navigation-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", translations ? text("menu_open") : "Open navigation");
    if (backdrop) backdrop.hidden = true;
    if (returnFocus) menuButton.focus();
  }
  function openNavigation() {
    if (!sidebar || !menuButton) return;
    if (isMobileNavigation()) {
      sidebar.classList.add("drawer-open");
      document.body.classList.add("navigation-open");
      if (backdrop) backdrop.hidden = false;
      sidebar.querySelector("a")?.focus();
    } else {
      document.querySelector(".app-layout")?.classList.remove("sidebar-collapsed");
    }
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", translations ? text("menu_close") : "Close navigation");
  }
  function toggleNavigation() {
    if (isMobileNavigation()) {
      if (sidebar?.classList.contains("drawer-open")) closeNavigation();
      else openNavigation();
      return;
    }
    const layout = document.querySelector(".app-layout");
    if (!layout) return;
    const collapsed = layout.classList.toggle("sidebar-collapsed");
    saveSetting(SIDEBAR_KEY, collapsed ? "true" : "false");
    menuButton?.setAttribute("aria-expanded", collapsed ? "false" : "true");
    if (menuButton && translations) menuButton.setAttribute("aria-label", text(collapsed ? "menu_open" : "menu_close"));
  }
  menuButton?.addEventListener("click", toggleNavigation);
  backdrop?.addEventListener("click", () => closeNavigation(true));
  sidebar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    if (isMobileNavigation()) closeNavigation();
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar?.classList.contains("drawer-open")) closeNavigation(true);
  });
  window.addEventListener("resize", () => {
    if (!isMobileNavigation()) {
      closeNavigation();
      const collapsed = document.querySelector(".app-layout")?.classList.contains("sidebar-collapsed");
      menuButton?.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
  });
  if (readSetting(SIDEBAR_KEY) === "true" && !isMobileNavigation()) {
    document.querySelector(".app-layout")?.classList.add("sidebar-collapsed");
    menuButton?.setAttribute("aria-expanded", "false");
  } else if (!isMobileNavigation()) {
    menuButton?.setAttribute("aria-expanded", "true");
  }

  const tutorial = $("first-run-tutorial");
  const tutorialSlides = [
    {title: "tutorial_title_1", copy: "tutorial_step_1", image: "/static/images/field-intercropping.jpg", credit: "Photo: W. Carter · CC0", source: "https://commons.wikimedia.org/wiki/File:Field_with_mixed_intercropping_of_oat_and_rye.jpg", action: "diagnose_cta", href: "/diagnose"},
    {title: "tutorial_title_2", copy: "tutorial_step_2", image: "/static/images/tamarillo-leaf.jpg", credit: "Photo: epSos.de · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Green_Leaf_of_a_Bio_Plant_in_Nature.jpg", action: "photo_guide_caption", href: "/diagnose"},
    {title: "tutorial_title_3", copy: "tutorial_step_3", image: "/static/images/potato-late-blight.jpg", credit: "Photo: Howard F. Schwartz / Colorado State University · CC BY 3.0 US", source: "https://commons.wikimedia.org/wiki/File:Late_blight_on_potato_leaf_2.jpg", action: "diagnose_cta", href: "/diagnose"},
    {title: "tutorial_title_4", copy: "tutorial_step_4", image: "/static/images/field-intercropping.jpg", credit: "Photo: W. Carter · CC0", source: "https://commons.wikimedia.org/wiki/File:Field_with_mixed_intercropping_of_oat_and_rye.jpg", action: "view_history", href: "/history"}
  ];
  const tutorialDots = $("tutorial-dots");
  tutorialSlides.forEach((_slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "tutorial-dot";
    dot.textContent = String(index + 1);
    dot.dataset.tutorialStep = String(index);
    dot.addEventListener("click", () => {
      tutorialStep = index;
      renderTutorial();
      $("tutorial-title").focus();
    });
    tutorialDots?.append(dot);
  });
  function renderTutorial() {
    if (!translations || !tutorial) return;
    $("tutorial-progress").textContent = text("tutorial_progress").replace("{current}", String(tutorialStep + 1));
    const slide = tutorialSlides[tutorialStep];
    $("tutorial-title").textContent = text(slide.title);
    $("tutorial-copy").textContent = text(slide.copy);
    $("tutorial-visual").src = slide.image;
    $("tutorial-photo-credit").href = slide.source;
    $("tutorial-photo-credit").textContent = slide.credit;
    $("tutorial-action").href = slide.href;
    $("tutorial-action-label").textContent = text(slide.action);
    tutorialDots?.querySelectorAll(".tutorial-dot").forEach((dot, index) => {
      dot.setAttribute("aria-label", text("tutorial_step_label").replace("{current}", String(index + 1)));
      if (index === tutorialStep) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });
    $("tutorial-back").hidden = tutorialStep === 0;
    $("tutorial-next").textContent = text(tutorialStep === tutorialSlides.length - 1 ? "finish" : "next");
    tutorial.scrollTop = 0;
  }
  function closeTutorial(markComplete) {
    if (!tutorial) return;
    if (markComplete) saveSetting(TUTORIAL_KEY, "true");
    tutorialSeenThisVisit = true;
    if (tutorial.open) tutorial.close();
    tutorialReturnFocus?.focus?.();
  }
  function openTutorial(replay) {
    if (!tutorial || !translations) return;
    if (!replay && readSetting(TUTORIAL_KEY) === "true") return;
    tutorialReturnFocus = document.activeElement;
    tutorialStep = 0;
    tutorialSeenThisVisit = true;
    renderTutorial();
    if (typeof tutorial.showModal === "function") tutorial.showModal();
    else tutorial.setAttribute("open", "");
    $("tutorial-title").focus();
  }
  document.querySelectorAll("[data-open-tutorial]").forEach((button) => button.addEventListener("click", () => openTutorial(true)));
  document.querySelectorAll("[data-close-tutorial]").forEach((button) => button.addEventListener("click", () => closeTutorial(true)));
  $("tutorial-back")?.addEventListener("click", () => {
    if (tutorialStep > 0) tutorialStep -= 1;
    renderTutorial();
    $("tutorial-title").focus();
  });
  $("tutorial-next")?.addEventListener("click", () => {
    if (tutorialStep < tutorialSlides.length - 1) {
      tutorialStep += 1;
      renderTutorial();
      $("tutorial-title").focus();
    } else closeTutorial(true);
  });
  $("tutorial-action")?.addEventListener("click", () => closeTutorial(true));
  tutorial?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeTutorial(true);
  });
  tutorial?.addEventListener("close", () => {
    tutorialSeenThisVisit = true;
    tutorialReturnFocus?.focus?.();
  });

  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    $("install-app").hidden = false;
  });
  $("install-app")?.addEventListener("click", async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    $("install-app").hidden = true;
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    if ($("install-app")) $("install-app").hidden = true;
  });

  async function updateBackendStatus() {
    const backend = $("backend-status");
    const model = $("model-status");
    if (!backend || !model || !translations) return;
    try {
      const response = await fetch("/api/health", {cache: "no-store"});
      if (!response.ok) throw new Error(`Backend returned ${response.status}.`);
      const status = await response.json();
      backend.textContent = text("backend_reachable");
      model.textContent = status.model_status === "ready" ? text("model_ready")
        : status.model_status === "loading" ? text("backend_model_loading")
          : status.model_status === "error" ? text("backend_model_error") : text("model_not_loaded");
    } catch (error) {
      console.warn("Could not reach the crop screening backend.", error);
      backend.textContent = text("backend_unavailable");
      model.textContent = text("model_unavailable");
    }
  }

  function historyEnabled() { return readSetting(HISTORY_KEY) === "true"; }
  async function openHistory() {
    if (!("indexedDB" in window)) throw new Error("IndexedDB is unavailable.");
    if (historyDb) return historyDb;
    historyDb = await new Promise((resolve, reject) => {
      const request = indexedDB.open("ai-crop-doctor-history", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("results")) request.result.createObjectStore("results", {keyPath: "id"});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open history."));
    });
    return historyDb;
  }
  async function readHistory() {
    const db = await openHistory();
    return new Promise((resolve, reject) => {
      const request = db.transaction("results", "readonly").objectStore("results").getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
      request.onerror = () => reject(request.error || new Error("Could not read history."));
    });
  }
  function appendBidi(parent, value) {
    const bidi = document.createElement("bdi");
    bidi.textContent = value;
    parent.append(bidi);
  }
  function makeHistoryRow(entry, deletable) {
    const row = document.createElement("article");
    row.className = "history-entry";
    const detail = document.createElement("div");
    detail.className = "history-entry-main";
    const title = document.createElement("strong");
    title.dir = "auto";
    const titleBidi = document.createElement("bdi");
    titleBidi.textContent = entry.label;
    title.append(titleBidi);
    const meta = document.createElement("span");
    const date = new Date(entry.timestamp).toLocaleString(translations[language].locale);
    meta.append(document.createTextNode(`${date} · `));
    appendBidi(meta, `${entry.score}%`);
    meta.append(document.createTextNode(` · ${entry.uncertain ? text("recent_status_uncertain") : text("recent_status_possible")}`));
    detail.append(title, meta);
    row.append(detail);
    if (deletable) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "secondary-button danger-button";
      remove.textContent = text("history_delete");
      remove.addEventListener("click", async () => {
        if (!window.confirm(text("history_confirm_delete"))) return;
        try {
          const db = await openHistory();
          await new Promise((resolve, reject) => {
            const request = db.transaction("results", "readwrite").objectStore("results").delete(entry.id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error || new Error("Could not delete history."));
          });
          await renderLocalHistory();
          await renderDashboardHistory();
        } catch (error) {
          console.error("Could not delete local history.", error);
          toast(text("history_unavailable"));
        }
      });
      row.append(remove);
    }
    return row;
  }
  async function renderLocalHistory() {
    const controls = $("history-controls");
    const checkbox = $("history-opt-in");
    const disabled = $("history-disabled");
    if (!controls || !checkbox || !disabled) return;
    const enabled = historyEnabled();
    const empty = $("history-no-results");
    checkbox.checked = enabled;
    controls.hidden = !enabled;
    disabled.hidden = enabled;
    if (empty) empty.hidden = true;
    if (!enabled) return;
    const list = $("history-list");
    try {
      const entries = await readHistory();
      list.replaceChildren();
      list.hidden = !entries.length;
      if (empty) empty.hidden = entries.length > 0;
      if (!entries.length) return;
      entries.forEach((entry) => list.append(makeHistoryRow(entry, true)));
    } catch (error) {
      console.error("Could not read local history.", error);
      list.hidden = false;
      const message = document.createElement("p");
      message.className = "history-empty";
      message.textContent = text("history_unavailable");
      list.replaceChildren(message);
      if (empty) empty.hidden = true;
      toast(text("history_unavailable"));
    }
  }
  async function renderDashboardHistory() {
    const region = $("dashboard-history");
    const list = $("dashboard-history-list");
    if (!region || !list || !translations) return;
    region.hidden = false;
    try {
      list.replaceChildren();
      if (!historyEnabled()) {
        const empty = document.createElement("p");
        empty.className = "history-empty";
        empty.textContent = text("recent_history_off");
        list.append(empty);
        return;
      }
      const entries = await readHistory();
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "history-empty";
        empty.textContent = text("recent_empty");
        list.append(empty);
      } else entries.slice(0, 3).forEach((entry) => list.append(makeHistoryRow(entry, false)));
    } catch (error) {
      console.error("Could not read dashboard history.", error);
      list.textContent = text("history_unavailable");
      toast(text("history_unavailable"));
    }
  }
  $("history-opt-in")?.addEventListener("change", async (event) => {
    saveSetting(HISTORY_KEY, event.currentTarget.checked ? "true" : "false");
    await renderLocalHistory();
    await renderDashboardHistory();
  });
  $("export-history")?.addEventListener("click", async () => {
    try {
      const entries = await readHistory();
      if (!entries.length) { toast(text("history_empty")); return; }
      const url = URL.createObjectURL(new Blob([JSON.stringify(entries, null, 2)], {type: "application/json"}));
      const link = document.createElement("a");
      link.href = url;
      link.download = "ai-crop-doctor-history.json";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Could not export local history.", error);
      toast(text("history_unavailable"));
    }
  });
  $("clear-history")?.addEventListener("click", async () => {
    if (!window.confirm(text("history_confirm_clear"))) return;
    try {
      const db = await openHistory();
      await new Promise((resolve, reject) => {
        const request = db.transaction("results", "readwrite").objectStore("results").clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("Could not clear history."));
      });
      await renderLocalHistory();
      await renderDashboardHistory();
      toast(text("history_deleted"));
    } catch (error) {
      console.error("Could not clear local history.", error);
      toast(text("history_unavailable"));
    }
  });

  if ("serviceWorker" in navigator && window.isSecureContext) {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("Service worker registration failed.", error);
    });
  }
  window.addEventListener("online", updateBackendStatus);
  window.addEventListener("offline", () => {
    if (translations) {
      $("backend-status").textContent = text("backend_unavailable");
      $("model-status").textContent = text("model_unavailable");
    }
  });
  loadTranslations().then(updateBackendStatus).catch((error) => {
    console.error("Could not initialize interface translations.", error);
    const status = $("backend-status");
    if (status) status.textContent = "Interface language data could not be loaded.";
  });
})();
