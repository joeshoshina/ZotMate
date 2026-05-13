/* eslint-disable no-undef */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => clients.claim());
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  );
});
