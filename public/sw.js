const CACHE_NAME = 'sgbge-cache-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Pass-through fetch for now to satisfy PWA requirements
    event.respondWith(fetch(event.request));
});
