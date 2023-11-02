/// <reference lib="WebWorker" />

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

const initData = async (topic: string, symkey: string, clientId: string, token: string) => {
  const db = await getDbSymkeyStore()
  const projectId = "7cb67f700b96a290fb5bb73d9001d489"

  const echoUrl = `${ECHO_URL}/${projectId}/clients`

  console.log({ symkey, topic, clientId, token, echoUrl })
  await db.put(SYMKEY_OBJ_STORE, symkey, topic)


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

  console.log({echoResponse: await echoResponse.text(), status: echoResponse.status})
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

//@ts-ignore
const _ = self.__WB_MANIFEST

self.addEventListener('install', () => {
  self.skipWaiting()
})
