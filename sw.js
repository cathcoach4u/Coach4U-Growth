const CACHE = 'coach4u-growth-v0.9.0';
const ASSETS = [
  './',
  'index.html',
  'login.html',
  'forgot-password.html',
  'reset-password.html',
  'inactive.html',
  'offline.html',
  'manifest.json',
  'favicon.svg',
  'images/logo.svg',
  'css/style.css',
  'js/ai.js',
  'growth/index.html',
  'growth/css/spa.css',
  'growth/js/app.js',
  'growth/js/strategy.js',
  'growth/js/quarterly.js',
  'growth/js/campaigns.js',
  'growth/js/content.js',
  'growth/js/metrics.js',
  'growth/js/ai.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached || fetch(e.request).catch(() =>
        e.request.headers.get('accept')?.includes('text/html')
          ? caches.match('offline.html')
          : new Response('Resource unavailable offline', { status: 503 })
      )
    )
  );
});
