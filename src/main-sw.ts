/// <reference lib="WebWorker" />

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('install', () => {
  self.skipWaiting()
})

// Self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// Clean old assets
cleanupOutdatedCaches()

// To allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))
