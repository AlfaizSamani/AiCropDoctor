const CACHE_PREFIX = "ai-crop-doctor-shell-";
const CACHE_NAME = `${CACHE_PREFIX}v23`;
const APP_SHELL = [
  "/",
  "/dashboard",
  "/diagnose",
  "/history",
  "/learn",
  "/getting-started",
  "/settings",
  "/about",
  "/manifest.webmanifest",
  "/model-labels.json",
  "/static/styles.css",
  "/static/enhancements.css",
  "/static/redesign.css",
  "/static/app.js",
  "/static/enhancements.js",
  "/static/site.js",
  "/static/ui-translations.json",
  "/static/offline.html",
  "/static/icons/icon-192.png",
  "/static/icons/icon-512.png",
  "/static/icons/icon-maskable-512.png",
  "/static/icons/brand-mark.png",
  "/static/images/pallavio-logo.png",
  "/static/images/field-intercropping.jpg",
  "/static/images/tamarillo-leaf.jpg",
  "/static/images/potato-late-blight.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match("/dashboard")) || caches.match("/static/offline.html")));
    return;
  }

  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    })));
  }
});
