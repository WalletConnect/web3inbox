import { SERVICE_WORKER_ACTIONS } from '@/utils/constants'

/// <reference lib="WebWorker" />

declare let self: ServiceWorkerGlobalScope

const clearCache = () => {
  self.caches.keys().then(cacheKeys => {
    cacheKeys.forEach(cacheKey => self.caches.delete(cacheKey))
  })
}

// Clear any cache
self.oninstall = () => {
  clearCache()
}

self.onactivate = () => {
  clearCache()
}

self.ononline = () => {
  clearCache()
}

self.addEventListener('message', event => {
  if (!event.data) return

  switch (event.data.type) {
    // Event to install latest service worker when available
    case SERVICE_WORKER_ACTIONS.SKIP_WAITING:
      self.skipWaiting()
      break
  }
})

self.addEventListener('install', () => {
  self.skipWaiting()
})
