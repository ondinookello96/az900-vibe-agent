// AfriCloud AZ-900 Progressive Web App (PWA) Service Worker
// Enables 100% offline functionality, asset caching, and offline local notifications.

const CACHE_NAME = 'africloud-az900-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Install Event: Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Some offline cache assets skipped during install:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First strategy with network fallback for offline usage
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache successful local responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If offline and request is an HTML navigation, serve cached index
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Message Event: Receives notification schedule requests from frontend (Offline-capable)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SCHEDULE_OFFLINE_NOTIFICATION') {
    const { title, options, delayMs } = event.data;
    
    // Schedule a local offline notification using background timer
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: options.body || 'Time to revise your weak AZ-900 topics!',
        icon: options.icon || '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        data: options.data || { url: '/' },
        tag: 'offline-study-reminder',
        renotify: true
      });
    }, delayMs || 1000);
  } else if (event.data.type === 'SHOW_OFFLINE_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      body: options.body,
      icon: options.icon || '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      data: options.data || { url: '/' },
      tag: 'instant-study-reminder'
    });
  }
});

// Notification Click Event: Directs user back to their active study sprint
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
