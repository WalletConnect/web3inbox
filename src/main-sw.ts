/// <reference lib="WebWorker" />
import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import { decryptMessage } from '@walletconnect/push-message-decrypter'
import { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import { openDB } from 'idb'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyAtOP2BXP4RNK0pN_AEBMkVjgmYqklUlKc',
  authDomain: 'javascript-48655.firebaseapp.com',
  projectId: 'javascript-48655',
  storageBucket: 'javascript-48655.appspot.com',
  messagingSenderId: '295861682652',
  appId: '1:295861682652:web:60f4b1e4e1d8adca230f19',
  measurementId: 'G-0BLLC7N3KW'
})

const ECHO_URL = 'https://echo.walletconnect.com'

const SYMKEY_OBJ_STORE = 'symkey-store'

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp)

const getDbSymkeyStore = async () => {
  const db = await openDB('w3i-sw-db', 2, {
    upgrade(database) {
      database.createObjectStore(SYMKEY_OBJ_STORE)
    }
  })
  return db
}

const getSymKey = async (topic: string) => {
  const db = await getDbSymkeyStore()

  const result: string = await db.get(SYMKEY_OBJ_STORE, topic)

  if (result) {
    return result
  }

  throw new Error('No symkey exists for such topic')
}

const initData = async (topic: string, symkey: string, clientId: string, token: string) => {
  const db = await getDbSymkeyStore()

  await db.put(SYMKEY_OBJ_STORE, symkey, topic)

  fetch(`${ECHO_URL}/clients`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      type: 'FCM',
      token
    })
  })
}

onBackgroundMessage(messaging, async firebaseMessage => {
  const { encoded, topic } = firebaseMessage.data!

  const symkey = await getSymKey(topic)

  const m = (await decryptMessage({
    encoded,
    symkey,
    topic
  })) as JsonRpcRequest<{ body: string; title: string }>

  self.registration.showNotification(m.params.title, {
    body: m.params.body
  })
})

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', event => {
  if (!event.data) return

  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    case 'INSTALL_SYMKEY_CLIENT':
      initData(event.data.topic, event.data.symkey, event.data.clientId, event.data.token)
      break
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
