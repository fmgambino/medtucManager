const CACHE = 'ism-robosoft-v25';
const STATIC_ASSETS = [
  './', './index.html', './app.html', './styles.css', './manifest.webmanifest',
  './assets/logo.svg', './assets/avatar-default.svg', './assets/img/logo-Coordinacion-Robotica.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isRuntimeConfig = url.pathname.endsWith('/js/config.js') || url.pathname.endsWith('/js/supabaseClient.js') || url.pathname.endsWith('/auth.js') || url.pathname.endsWith('/js/app.js');
  if (isRuntimeConfig) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    fetch(event.request).then(networkRes => {
      const copy = networkRes.clone();
      if (url.origin === self.location.origin) caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => null);
      return networkRes;
    }).catch(() => caches.match(event.request).then(res => res || caches.match('./index.html')))
  );
});
