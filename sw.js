// Cache-Version
const CACHE_NAME = 'schichtprotokoll-cache-v1';

// Ressourcen, die im Cache gespeichert werden sollen
const urlsToCache = [
  '/',
  '/index.html',
  '/maschinen.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Weitere Ressourcen hier hinzufügen
];

// Installation des Service Workers und Caching der Ressourcen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache geöffnet');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivierung des Service Workers und Bereinigung alter Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Alten Cache löschen:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Netzwerkanfragen abfangen und auf den Cache zurückgreifen
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Rückgabe des Cache-Treffers oder Abruf aus dem Netzwerk
        return response || fetch(event.request);
      })
  );
});
