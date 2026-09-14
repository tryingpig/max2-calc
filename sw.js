/* 오프라인용 캐시. 파일을 고치면 CACHE 이름의 버전을 올린다. */
const CACHE = 'max2-calc-v8';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/app-192.png', './icons/app-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
/* 네트워크 우선, 실패하면 캐시. 고친 파일이 바로 반영되고 오프라인에서도 열린다. */
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
