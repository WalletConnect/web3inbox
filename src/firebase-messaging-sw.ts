/// <reference lib="WebWorker" />
import { getMessaging } from 'firebase/messaging/sw'
import { decryptMessage } from '@walletconnect/notify-message-decrypter'
import { onBackgroundMessage } from 'firebase/messaging/sw'
import { openDB } from 'idb'
import { initializeApp } from 'firebase/app'

declare let self: ServiceWorkerGlobalScope

const SYMKEY_OBJ_STORE = 'symkey-store'

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyAtOP2BXP4RNK0pN_AEBMkVjgmYqklUlKc',
  authDomain: 'javascript-48655.firebaseapp.com',
  projectId: 'javascript-48655',
  storageBucket: 'javascript-48655.appspot.com',
  messagingSenderId: '295861682652',
  appId: '1:295861682652:web:60f4b1e4e1d8adca230f19',
  measurementId: 'G-0BLLC7N3KW'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages. Need to keep this alive

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

const messaging = getMessaging(firebaseApp)
onBackgroundMessage(messaging, (ev) => {
  console.log("Got background message", ev);
  
  self.registration.showNotification("tm 1", {
    body: "tm b 1"
  })
})

self.addEventListener('push', async ev => {

  console.log("recieved pushEvent", ev)

  const { blob: encoded, topic } = ev.data!.json().data

  console.log("recieved pushEvent from topic", topic)

  const symkey = await getSymKey(topic)

  const m = await decryptMessage({
    encoded,
    symkey,
    topic
  })

  console.log("recieved pushEvent from topic", topic)

  self.registration.showNotification(m.title, {
    image: m.icon,
    body: m.body
  })
})
