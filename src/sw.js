const CACHE_NAME = 'sacconova-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Sync offline transactions when connection is restored
  const offlineData = await getOfflineData();
  if (offlineData.length > 0) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(offlineData),
        headers: { 'Content-Type': 'application/json' }
      });
      await clearOfflineData();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

async function getOfflineData() {
  // Get offline data from IndexedDB
  return [];
}

async function clearOfflineData() {
  // Clear synced offline data
}