/// <reference lib="WebWorker" />

declare let self: ServiceWorkerGlobalScope

import { SERVICE_WORKER_ACTIONS } from './utils/constants'

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
