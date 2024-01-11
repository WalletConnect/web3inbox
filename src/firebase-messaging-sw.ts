/// <reference lib="WebWorker" />
import { decryptMessage } from '@walletconnect/notify-message-decrypter'
import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

import { getDbSymkeyStore } from '@/utils/idb'

declare let self: ServiceWorkerGlobalScope

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
const messaging = getMessaging(firebaseApp)

const getSymKey = async (topic: string) => {
  const [getSymKeyUsingTopic] = await getDbSymkeyStore()

  const result: string = await getSymKeyUsingTopic(topic)

  if (result) {
    return result
  }

  throw new Error(`No symkey exists for such topic: ${topic}`)
}

onBackgroundMessage(messaging, async ev => {
  const encoded = ev.data?.blob
  const topic = ev.data?.topic

  if (!encoded || !topic) {
    // Console Errors can be viewed via Chrome and Firefox devtools
    console.error(`Received incorrect payload > blob: ${encoded} | topic: ${topic}`)
    return
  }

  const symkey = await getSymKey(topic)

  const m = await decryptMessage({ encoded, symkey, topic })

  return self.registration.showNotification(m.title, {
    icon: m.icon,
    body: m.body
  })
})
