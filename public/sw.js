/**
 * Mr. Cafe - Service Worker
 * Version: 1.0.0
 * Strategy: Safe App Shell Precaching, Network-Only API & Auth, Client-Side Routing Fallback
 */

const SHELL_CACHE_NAME = 'mr-cafe-shell-v1';
const STATIC_CACHE_NAME = 'mr-cafe-static-v1';

const ALLOWED_CACHES = [SHELL_CACHE_NAME, STATIC_CACHE_NAME];

// App Shell resources precached on installation
const APP_SHELL_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.png',
  '/logo.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png'
];

// Install Event: Precache safe app shell & skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_PRECACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Claim clients & purge incompatible old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('mr-cafe-') && !ALLOWED_CACHES.includes(cacheName)) {
            console.log('[SW] Deleting obsolete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Helper: Check if request is sensitive (API, Auth, WebSockets, Payments)
function isSensitiveOrApiRequest(request) {
  const url = new URL(request.url);

  // Non-GET requests (POST, PUT, DELETE, PATCH) are never cached
  if (request.method !== 'GET') return true;

  // Bypass API endpoints
  if (url.pathname.includes('/api/')) return true;

  // Bypass WebSockets & real-time socket connection requests
  if (url.pathname.includes('/socket.io/') || url.protocol === 'ws:' || url.protocol === 'wss:') return true;

  // Bypass payment, auth, and user sensitive endpoints
  if (
    url.pathname.includes('/payments/') ||
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/chapa') ||
    url.hostname.includes('chapa')
  ) {
    return true;
  }

  return false;
}

// Fetch Event Listener
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Bypass sensitive requests (API, Auth, WebSockets, Payments) -> Network Only
  if (isSensitiveOrApiRequest(request)) {
    return; // Browser default network handling
  }

  // 2. Navigation requests (HTML pages for React Router client-side routing)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If network returns a valid page response, cache a copy in shell cache
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(SHELL_CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          }
          return response;
        })
        .catch(async () => {
          // Network failed: Serve cached SPA index.html for React Router
          const shellCache = await caches.open(SHELL_CACHE_NAME);
          const cachedIndex = await shellCache.match('/index.html');
          if (cachedIndex) return cachedIndex;

          // Offline Fallback Page if app shell is unavailable
          const cachedOffline = await shellCache.match('/offline.html');
          if (cachedOffline) return cachedOffline;

          return new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // 3. Static assets & immutable resources (JS, CSS, Images, Fonts)
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot|ico)$/i)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Stale-While-Revalidate Strategy for static assets
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Listener for update messages from front-end registration script
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
