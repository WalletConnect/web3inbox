/// <reference lib="WebWorker" />
import { decryptMessage } from '@walletconnect/notify-message-decrypter'
import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

import { getDbSymkeyStore } from '@/utils/idb'

declare let self: ServiceWorkerGlobalScope

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyC-tpdIHBkzdEvGXtpIc-pS6qwVhyNkTc4",
  authDomain: "javascript-fcm-v1.firebaseapp.com",
  projectId: "javascript-fcm-v1",
  storageBucket: "javascript-fcm-v1.appspot.com",
  messagingSenderId: "407161152156",
  appId: "1:407161152156:web:c85abffa07cfa1af90c359"
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
    body: m.body,
    data: { url: m.url }
  })
})

self.addEventListener('notificationclick', e => {
  const url = e.notification?.data?.url

  e.notification.close()

  if (!url) {
    return
  }

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
      const hadWindowToFocus = clientsArr.some(windowClient => {
        return windowClient.url === url ? (windowClient.focus(), true) : false
      })
      if (!hadWindowToFocus) {
        self.clients
          .openWindow(url)
          .then(windowClient => (windowClient ? windowClient.focus() : null))
      }
    })
  )
})
