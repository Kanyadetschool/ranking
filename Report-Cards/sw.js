// ═══════════════════════════════════════════════════
//  SERVICE WORKER — Kanyadet Student Portal
//  Caches shell + CDN assets; serves stale-while-revalidate
// ═══════════════════════════════════════════════════
const CACHE = 'kss-portal-v1';
const SHELL = [
  './',
  './Individual-student-portal-fixed.html',
];
const CDN_CACHE = 'kss-cdn-v1';
const CDN_HOSTS = ['cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== CDN_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Firebase / gstatic — network only (real-time data must be fresh)
  if (url.hostname.includes('firebase') || url.hostname.includes('gstatic')) return;

  // CDN assets — cache first, then network
  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(CDN_CACHE).then(async c => {
        const hit = await c.match(e.request);
        if (hit) return hit;
        try {
          const res = await fetch(e.request);
          if (res.ok) c.put(e.request, res.clone());
          return res;
        } catch { return hit || new Response('', {status: 503}); }
      })
    );
    return;
  }

  // Same-origin HTML/JS/CSS/images — stale while revalidate
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(async c => {
        const hit = await c.match(e.request);
        const fetchPromise = fetch(e.request).then(res => {
          if (res.ok) c.put(e.request, res.clone());
          return res;
        }).catch(() => null);
        return hit || await fetchPromise || new Response('Offline', {status: 503});
      })
    );
  }
});
