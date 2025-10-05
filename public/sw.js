const CACHE_NAME = 'fuji-seat-app-v3';
const STATIC_CACHE = 'fuji-seat-static-v3';
const DYNAMIC_CACHE = 'fuji-seat-dynamic-v3';
const ICON_CACHE = 'fuji-seat-icons-v3';

// Separate icon caching for better performance
const ICON_URLS = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

const EXTERNAL_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Helper function for optimized icon caching
async function cacheIconsWithRetry() {
  const iconCache = await caches.open(ICON_CACHE);
  const cachePromises = ICON_URLS.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await iconCache.put(url, response);
        console.log(`✅ Icon cached: ${url}`);
      } else {
        console.warn(`⚠️ Icon fetch failed: ${url}, status: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Icon cache error for ${url}:`, error);
    }
  });
  
  await Promise.allSettled(cachePromises);
}

// Install event - Cache static assets with optimized icon handling
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_URLS);
      }),
      // Cache external resources
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('🌐 Caching external assets');
        return cache.addAll(EXTERNAL_URLS);
      }),
      // Cache icons separately for better performance
      cacheIconsWithRetry()
    ]).catch(error => {
      console.error('💥 Cache installation failed:', error);
    })
  );
  self.skipWaiting();
});

// Activate event - Clean old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== ICON_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Implement optimized cache strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip Chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    (async () => {
      try {
        // Special handling for icons - Cache first with fallback
        if (url.pathname.includes('/icons/')) {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            console.log('📱 Icon served from cache:', url.pathname);
            return cachedResponse;
          }
          
          // Try to fetch and cache icon
          try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
              const iconCache = await caches.open(ICON_CACHE);
              await iconCache.put(request, networkResponse.clone());
              console.log('📱 Icon cached from network:', url.pathname);
              return networkResponse;
            }
          } catch (error) {
            console.warn('⚠️ Icon fetch failed:', url.pathname, error);
          }
          
          // Return fallback icon or placeholder
          return new Response('', {
            status: 404,
            statusText: 'Icon Not Found'
          });
        }

        // For API requests - Network first, then cache
        if (url.pathname.startsWith('/api/')) {
          try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
              const cache = await caches.open(DYNAMIC_CACHE);
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          } catch (error) {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
            throw error;
          }
        }

        // For static assets - Cache first, then network
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Network fallback
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
      } catch (error) {
        console.error('Fetch failed:', error);
        
        // Return offline page for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
          const offlineResponse = await caches.match('/');
          if (offlineResponse) {
            return offlineResponse;
          }
        }
        
        // Return a generic offline response
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Background sync for data updates
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Implement background sync logic here
  }
});

// Push notifications handler
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    console.log('Push notification received:', data);
    
    const options = {
      body: data.body || 'Ada update data baru',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'fuji-seat-notification',
      requireInteraction: true
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Fuji Seat Laporan', options)
    );
  }
});