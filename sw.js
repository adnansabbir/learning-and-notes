---
---
const BASE = '{{ site.baseurl }}';
const CACHE = 'notes-v22';

const PRECACHE = [
  `${BASE}/assets/js/pyrun.js`,
  `${BASE}/`,
  `${BASE}/tryhackme/`,
  `${BASE}/tryhackme/linux/`,
  `${BASE}/tryhackme/linux/basics/`,
  `${BASE}/tryhackme/linux/system/`,
  `${BASE}/tryhackme/linux/vim/`,
  `${BASE}/tryhackme/windows/`,
  `${BASE}/tryhackme/windows/basics/`,
  `${BASE}/tryhackme/networking/`,
  `${BASE}/tryhackme/networking/basics/`,
  `${BASE}/tryhackme/networking/mac-addresses/`,
  `${BASE}/tryhackme/recon/`,
  `${BASE}/tryhackme/recon/nmap/`,
  `${BASE}/tryhackme/recon/web-recon/`,
  `${BASE}/tryhackme/recon/search-skills/`,
  `${BASE}/tryhackme/defenses/`,
  `${BASE}/machine-learning/`,
  `${BASE}/machine-learning/supervised-learning/`,
  `${BASE}/machine-learning/supervised-learning/regression/`,
  `${BASE}/machine-learning/supervised-learning/classification/`,
  `${BASE}/machine-learning/supervised-learning/training-data-and-notation/`,
  `${BASE}/machine-learning/supervised-learning/from-data-to-a-model-function/`,
  `${BASE}/machine-learning/unsupervised-learning/`,
  `${BASE}/machine-learning/unsupervised-learning/clustering/`,
  `${BASE}/machine-learning/unsupervised-learning/anomaly-detection/`,
  `${BASE}/machine-learning/unsupervised-learning/dimensionality-reduction/`,
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);

        return cached ?? fresh;
      })
    )
  );
});
