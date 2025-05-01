// Service Worker for Createathon
const CACHE_NAME = "createathon-cache-v1";

// Assets to cache immediately on SW installation
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/assets/css/main.css",
  "/assets/js/main.js",
  "/fonts/font-stylesheet.css",
  "/svg.svg",
];

// Installation event
self.addEventListener("install", (event) => {
  // Precache critical assets
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activation event
self.addEventListener("activate", (event) => {
  // Clean up old caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Define cacheable assets by file type
const CACHEABLE_EXTENSIONS = [
  ".css",
  ".js",
  ".woff",
  ".woff2",
  ".ttf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".svg",
  ".ico",
  ".json",
];

// Fetch event with stale-while-revalidate strategy for most assets
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests and browser extension requests
  if (
    event.request.method !== "GET" ||
    requestUrl.protocol === "chrome-extension:" ||
    requestUrl.hostname === "analytics.google.com" ||
    requestUrl.hostname === "www.google-analytics.com"
  ) {
    return;
  }

  // Check if the request is for a cacheable asset
  const shouldCache = CACHEABLE_EXTENSIONS.some(
    (ext) =>
      event.request.url.endsWith(ext) || event.request.url.includes(`/assets/`)
  );

  // URLs that should never be cached (API calls, etc)
  const isUncacheable = event.request.url.includes("/api/");

  if (shouldCache && !isUncacheable) {
    // For cacheable assets, use stale-while-revalidate
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Only cache valid responses
              if (
                networkResponse &&
                networkResponse.status === 200 &&
                networkResponse.type === "basic"
              ) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((error) => {
              console.error("Fetch failed:", error);
              // Return a cached response or fallback content here if needed
            });

          // Return the cached response or wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else {
    // For other requests, prefer network with cache fallback
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});

// Push notification event handler
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body || "New notification from Createathon",
      icon: "/assets/images/logo.png",
      badge: "/assets/images/badge.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Createathon", options)
    );
  } catch (error) {
    console.error("Push notification error:", error);
  }
});

// Notification click event - open the app to relevant page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
