/* FinTrack offline worker.
   The page itself is fetched fresh when online (so updates arrive), and served from cache when offline.
   Fonts, icons and the Excel library are served from cache first. BUILD is replaced on every deploy. */
const CACHE = "fintrack-BUILD";
const FILES = [
  "./", "./index.html", "./install.html", "./manifest.webmanifest",
  "./lib/xlsx.full.min.js", "./fonts/fonts.css",
  "./fonts/instrument-sans-latin-400-normal.woff2", "./fonts/instrument-sans-latin-500-normal.woff2",
  "./fonts/instrument-sans-latin-600-normal.woff2", "./fonts/instrument-sans-latin-700-normal.woff2",
  "./fonts/ibm-plex-mono-latin-400-normal.woff2", "./fonts/ibm-plex-mono-latin-500-normal.woff2",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-64.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("fintrack-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.url.endsWith(".apk")) return; // never cache the Android download
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
