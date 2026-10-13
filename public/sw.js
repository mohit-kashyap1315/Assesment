const SHELL_CACHE = "binaire-store-shell-v1";
const MEDIA_CACHE = "binaire-store-media-v1";
const OFFLINE_ENTRY = new URL("./", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.add(OFFLINE_ENTRY))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith("binaire-store-") && name !== SHELL_CACHE && name !== MEDIA_CACHE)
          .map((name) => caches.delete(name)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin === self.location.origin && request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            await caches.open(SHELL_CACHE).then((cache) => cache.put(OFFLINE_ENTRY, response.clone()));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_ENTRY))),
    );
    return;
  }

  const isLocalAsset = url.origin === self.location.origin
    && ["script", "style", "font", "image"].includes(request.destination);
  const isCatalogImage = url.hostname === "image.tmdb.org" && request.destination === "image";
  if (!isLocalAsset && !isCatalogImage) return;

  event.respondWith(
    caches.open(isCatalogImage ? MEDIA_CACHE : SHELL_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok || response.type === "opaque") {
          await cache.put(request, response.clone());
          const keys = await cache.keys();
          const limit = isCatalogImage ? 60 : 80;
          if (keys.length > limit) {
            await cache.delete(keys[0]);
          }
        }
        return response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }),
  );
});
