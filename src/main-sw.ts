/// <reference lib="WebWorker" />

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

self.onmessage = event => {
  console.log('GOT AN EVENT', event)
}

self.addEventListener('message', event => {
  console.log('HERE', event)
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'MESSAGE_RECEIVED') {
    const notification = new Notification(event.data.author, event.data.message)
  }
})

// Self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// Clean old assets
cleanupOutdatedCaches()

// To allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))
