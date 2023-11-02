/// <reference lib="WebWorker" />

declare let self: ServiceWorkerGlobalScope

import { openDB } from 'idb'

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

const registerWithEcho = async (clientId: string, token: string) => {
  const projectId = '7cb67f700b96a290fb5bb73d9001d489'

  const echoUrl = `${ECHO_URL}/${projectId}/clients`

  const echoResponse = await fetch(echoUrl, {
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

  console.log({ echoResponse: await echoResponse.text(), status: echoResponse.status })
}

const setupSubscriptionSymkey = async (topic: string, symkey: string) => {
  const db = await getDbSymkeyStore()

  await db.put(SYMKEY_OBJ_STORE, symkey, topic)
}

const setupSubscriptionsSymkeys = async (topicSymkeyEntries: [string,string][]) => {
  topicSymkeyEntries.forEach(([topic, symkey]) => setupSubscriptionSymkey(topic, symkey))

  for(const [topic, symkey] of topicSymkeyEntries) {
    setupSubscriptionSymkey(topic, symkey)
  }
}

self.addEventListener('message', event => {
  if (!event.data) return

  switch (event.data.type) {
    // Event to install latest service worker when available
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    // Event to download symkey into indexedDb and setup the store
    case 'SET_SUBS_SYMKEYS':
      setupSubscriptionsSymkeys(event.data.topicSymkeyEntries);
      break
    // Event to register with echo
    case 'REGISTER_WITH_ECHO':
      registerWithEcho(event.data.clientId, event.data.token);
      break;
  }
})

self.addEventListener('install', () => {
  self.skipWaiting()
})
