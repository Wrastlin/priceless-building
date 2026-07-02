// Service worker for the Price-Less Admin PWA.
//
// Two jobs:
//  1. Satisfy the installability requirement — a registered SW with a
//     `fetch` handler is what makes Chrome / Edge / Android offer
//     "Install app" (iOS installs from the manifest without a SW).
//  2. Give a graceful offline fallback for admin navigations and a
//     stale-while-revalidate cache for admin assets.
//
// Scope is /admin only (see the registration call), so the public
// storefront is never intercepted or cached by this worker.

const CACHE = "pl-admin-v1";
const OFFLINE_HTML =
  '<!doctype html><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  "<title>Offline · Price-Less Admin</title>" +
  '<body style="font-family:system-ui,-apple-system,sans-serif;background:#f7f7f6;color:#1c1c1c;display:grid;place-items:center;height:100vh;margin:0;text-align:center">' +
  '<div><h1 style="font-size:1.25rem;margin:0 0 .5rem">You’re offline</h1>' +
  '<p style="color:#666;margin:0">Reconnect to keep working in the admin.</p></div></body>';

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Drop old cache versions on activate.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Navigations: network-first so staff always see fresh, auth-checked
  // content; fall back to a simple offline page when there's no network.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(
        () =>
          new Response(OFFLINE_HTML, {
            headers: { "content-type": "text/html; charset=utf-8" },
          }),
      ),
    );
    return;
  }

  // Assets: stale-while-revalidate.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
