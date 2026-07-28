/* 天晟急診教學 — Service Worker
   策略：同源請求「網路優先、失敗才用快取」
   → 有網路時永遠拿到最新教材，沒網路時仍可離線閱讀。
   改版後想強制清掉舊快取，把下面的版本號 +1 即可。 */

const CACHE = 'er-edu-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './data/courses.js',
  './data/quiz.js',
  './data/quickref.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL).catch(err => console.warn('預先快取部分失敗', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;   // 外部資源（YouTube 等）不攔截

  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
