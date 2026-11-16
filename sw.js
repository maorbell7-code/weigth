/* Offline support. Data lives in localStorage, never touched here. */
var CACHE = "weight-v1";
var CORE = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icon.svg"];
var CDN = ["https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all([
      c.addAll(CORE),
      Promise.all(CDN.map(function (u) { return fetch(u, { mode: "no-cors" }).then(function (r) { return c.put(u, r); }).catch(function () {}); }))
    ]);
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  var cacheable = url.origin === location.origin || /(^|\.)(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname);
  if (!cacheable) return;

  if (req.mode === "navigate") {
    /* network first so updates arrive; cache when offline */
    e.respondWith(fetch(req).then(function (r) {
      var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put("index.html", copy); });
      return r;
    }).catch(function () { return caches.match("index.html").then(function (m) { return m || caches.match("./"); }); }));
    return;
  }
  /* stale-while-revalidate for everything else */
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req).then(function (hit) {
      var net = fetch(req).then(function (r) { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
