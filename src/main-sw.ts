/// <reference lib="WebWorker" />
import { openDB } from 'idb'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

const ECHO_URL = 'https://echo.walletconnect.com'

const SYMKEY_OBJ_STORE = 'symkey-store'

const getDbSymkeyStore = async () => {
  const db = await openDB('w3i-sw-db', 3, {
    upgrade(database) {
      const exists = database.objectStoreNames.contains(SYMKEY_OBJ_STORE)
      if (!exists) {
        database.createObjectStore(SYMKEY_OBJ_STORE)
      }
    }
  })
  return db
}

const initData = async (topic: string, symkey: string, clientId: string, token: string) => {
  const db = await getDbSymkeyStore()

  console.log({ symkey, topic, clientId, token })
  await db.put(SYMKEY_OBJ_STORE, symkey, topic)

  fetch(`${ECHO_URL}/${'547aafa48826c4d76f492efecde4843d'}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      type: 'FCM',
      token
    })
  })
}

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', event => {
  if (!event.data) return

  switch (event.data.type) {
    // Event to install latest service worker when available
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    // Event to download symkey into indexedDb and setup the store
    case 'INSTALL_SYMKEY_CLIENT':
      initData(event.data.topic, event.data.symkey, event.data.clientId, event.data.token)
      break
  }
})

self.addEventListener('install', () => {
  self.skipWaiting()
})

// Clean old assets
cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)
