// Surghor offline cache.
// The page and the three sites' song lists are fetched fresh when online (so daily
// updates show up) and fall back to the saved copy when offline. Icons and fonts are
// saved the first time they load. YouTube itself always needs the network.
const CACHE = "surghor-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
const DATA = ["/Anandadhara/songs.json", "/Raagmala/raagmala.json", "/Piano/works.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const mine = url.origin === location.origin;
  const fresh = req.mode === "navigate" || (mine && (url.pathname.endsWith("/index.html") || DATA.includes(url.pathname)));

  if (fresh) {
    // "no-cache" asks GitHub Pages whether the file changed, instead of trusting the
    // browser's own copy for up to 10 minutes after a push.
    e.respondWith(fetch(req.url, {cache: "no-cache"}).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!(mine && url.pathname.startsWith("/Surghor/")) && !fonts) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
