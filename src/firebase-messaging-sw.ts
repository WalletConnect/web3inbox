/// <reference lib="WebWorker" />
import { getMessaging } from 'firebase/messaging/sw'
import { decryptMessage } from '@walletconnect/push-message-decrypter'
import { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import { onBackgroundMessage } from 'firebase/messaging/sw'
import { openDB } from 'idb'
import { initializeApp } from 'firebase/app'

declare let self: ServiceWorkerGlobalScope

const SYMKEY_OBJ_STORE = 'symkey-store'

const firebaseApp = initializeApp({
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp)

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

const getSymKey = async (topic: string) => {
  const db = await getDbSymkeyStore()

  const result: string = await db.get(SYMKEY_OBJ_STORE, topic)

  if (result) {
    return result
  }

  throw new Error('No symkey exists for such topic')
}

onBackgroundMessage(messaging, async firebaseMessage => {
  const { encoded, topic } = firebaseMessage.data!

  const symkey = await getSymKey(topic)

  console.log('Got message!', symkey, topic)

  const m = (await decryptMessage({
    encoded,
    symkey,
    topic
  })) as JsonRpcRequest<{ body: string; title: string }>

  self.registration.showNotification(m.params.title, {
    body: m.params.body
  })
})
