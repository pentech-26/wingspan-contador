// Service worker del Contador de Wingspan (PenTech)
// Red primero; la caché solo sirve para usar la app sin conexión.
// Subir CACHE en cada publicación.
const CACHE = 'wingspan-contador-v16';
const PREFIJO = 'wingspan-contador-';
const BASE = new URL('./', self.location).pathname;
const ARCHIVOS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon-32.png', 'splash.webp',
  'fonts/antonio-latin-200-normal.woff2', 'fonts/antonio-latin-500-normal.woff2', 'fonts/jost-latin-600-normal.woff2',
  'fonts/lora-latin-400-normal.woff2', 'fonts/lora-latin-400-italic.woff2', 'fonts/lora-latin-500-normal.woff2', 'fonts/lora-latin-600-normal.woff2',
  'fonts/cormorant-sc-latin-700-normal.woff2', 'fonts/dancing-script-latin-600-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  // Solo borra cachés propias: el dominio se comparte con otros contadores y con LudoTech
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIJO) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
