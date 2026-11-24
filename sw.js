/* Gemaakt tijdens het bouwen. Niet met de hand aanpassen. */
const VERSIE = "rekenkampioen-8.0.0-74ab138540";
const BESTANDEN = ["./","apple-touch-icon.png","assets/baloo-2-latin-600-normal-tIfxVoAe.woff2","assets/baloo-2-latin-800-normal-BbF3Etk1.woff2","assets/index-B37iY2mj.css","assets/index-BS-hr5hc.js","assets/lexend-latin-400-normal-CwRJVcUA.woff2","assets/lexend-latin-500-normal-Dl-X5nog.woff2","assets/lexend-latin-600-normal-DdvlkEkX.woff2","icon-192.png","icon-512.png","manifest.webmanifest","privacy.html"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSIE).then((c) => c.addAll(BESTANDEN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((namen) => Promise.all(namen.filter((n) => n.startsWith('rekenkampioen-') && n !== VERSIE).map((n) => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  /* Pagina's: eerst het netwerk (zodat een nieuwe versie meteen komt), anders de bewaarde kopie. */
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSIE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./'))));
    return;
  }
  /* Bestanden met een vingerafdruk in de naam veranderen nooit: eerst uit de bewaarde kopie. */
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(VERSIE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
