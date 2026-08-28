/* Service worker de Finances.
   Mateixa estratègia que el Field Service Log i el Calendari: xarxa primer amb
   3 s de paciència i còpia local si no arriba. Així sempre obres l'última versió
   quan hi ha connexió, i l'app segueix obrint sense cobertura.

   El finances.json NO es cacheja mai: les dades han de venir sempre de debò
   (del Drive o del servidor), que si no acabaries editant una còpia vella. */
const CACHE = "finances-v1";
const SHELL = ["./", "./index.html"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, {cache: "no-store"}))))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function respon(req) {
  const cache = await caches.open(CACHE);
  const copia = await cache.match(req);
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const xarxa = await fetch(req, {signal: ctrl.signal});
    clearTimeout(t);
    if (xarxa && xarxa.ok) cache.put(req, xarxa.clone());
    return xarxa;
  } catch (e) {
    if (copia) return copia;
    throw e;
  }
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;                 // els PUT de desar, mai
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;       // Google i companyia, mai
  if (url.pathname.endsWith("finances.json")) return;  // les dades, mai
  if (url.pathname.endsWith("__can_write")) return;
  e.respondWith(respon(req));
});
