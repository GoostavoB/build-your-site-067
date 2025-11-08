// Service Worker for The Trading Diary
const CACHE_NAME = 'trading-diary-v6';
const RUNTIME_CACHE = 'runtime-cache-v6';

// Static assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/favicon.png',
  '/logo-192.png',
  '/logo-512.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network first with cache fallback for API, cache first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network first, cache as fallback
  if (url.pathname.includes('/api/') || url.pathname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request);
        })
    );
    return;
  }

  // JavaScript modules - Always fetch fresh with correct MIME types (bypass cache)
  if (request.destination === 'script' || url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
    event.respondWith(
      (async () => {
        const maxRetries = 3;
        let lastError;
        
        // Retry logic with exponential backoff
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            const response = await fetch(request, {
              cache: 'no-cache',
              credentials: 'same-origin'
            });
            
            // Only accept successful responses with correct MIME type
            if (response.ok) {
              const contentType = response.headers.get('content-type');
              if (contentType && (contentType.includes('javascript') || contentType.includes('ecmascript'))) {
                console.log(`[SW] Successfully loaded script: ${url.pathname}`);
                return response;
              } else {
                console.warn(`[SW] Script has incorrect MIME type: ${contentType} for ${url.pathname}`);
                // Continue to retry
              }
            }
            
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          } catch (error) {
            lastError = error;
            console.warn(`[SW] Script load attempt ${attempt + 1}/${maxRetries} failed for ${url.pathname}:`, error);
          }
          
          // Exponential backoff: 100ms, 200ms, 400ms
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
          }
        }
        
        // All retries failed, try cache as last resort
        console.error(`[SW] All retry attempts failed for ${url.pathname}, trying cache fallback`);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.warn(`[SW] Serving stale cached version of ${url.pathname}`);
          return cachedResponse;
        }
        
        // No cache available, return error response
        console.error(`[SW] Complete failure loading script ${url.pathname}:`, lastError);
        return new Response(
          `// Script load failed: ${url.pathname}\n// Error: ${lastError?.message || 'Unknown error'}\nconsole.error('Failed to load module: ${url.pathname}');`,
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/javascript' }
          }
        );
      })()
    );
    return;
  }

  // Static assets - Stale while revalidate to prevent stale images
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // HTML pages - Network first with cache fallback to ensure fresh index.html
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'The Trading Diary';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/logo-192.png',
    badge: '/logo-192.png',
    data: data.url || '/',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
