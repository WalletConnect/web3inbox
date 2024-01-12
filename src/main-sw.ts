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
  console.log('>>> SW: oninstall')
  clearCache()
}

self.onactivate = () => {
  console.log('>>> SW: oninactive')
  clearCache()
}

self.ononline = () => {
  console.log('>>> SW: ononline')
  clearCache()
}

self.addEventListener('message', event => {
  console.log('>>> SW: message', event?.data)
  if (!event.data) return

  switch (event.data.type) {
    // Event to install latest service worker when available
    case SERVICE_WORKER_ACTIONS.SKIP_WAITING:
      self.skipWaiting()
      break
  }
})

// In your service worker
self.addEventListener('push', event => {
  console.log('>>> SW: push event', event)
  const data = event?.data?.json()
  // Store data for the app to access later
  // Show a notification
  self.registration.showNotification(data.title, {
    body: data.body
    // other options
  })
})

self.addEventListener('notificationclick', event => {
  console.log('>>> SW: notificationclick event', event)
  event.notification.close()

  event.waitUntil(
    self.clients.openWindow('/') // Opens your app
  )
})

self.addEventListener('install', () => {
  self.skipWaiting()
})
