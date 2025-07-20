const CACHE_NAME = 'projeto-vida-v1.0.0'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/fundo-background.png',
  // Adicione outros assets estáticos aqui
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})
