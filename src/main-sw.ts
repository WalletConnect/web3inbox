/// <reference lib="WebWorker" />

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import ChatClient from '@walletconnect/chat-client'

declare let self: ServiceWorkerGlobalScope

let chatClient: ChatClient

self.oninstall = () => {
  console.log('Installing, init client')
  ChatClient.init({
    logger: 'debug',
    relayUrl: import.meta.env.VITE_RELAY_URL,
    projectId: import.meta.env.VITE_PROJECT_ID
  }).then(client => {
    console.log('Successful init')
    chatClient = client
    chatClient.on('chat_message', message => {
      console.log('Got message')
      const notification = new Notification(message.params.authorAccount, {
        timestamp: message.params.timestamp,
        body: message.params.message
      })
    })
  })
}

self.onmessage = event => {
  console.log('Got event', event.data, event)
  switch (event.data.type) {
    case 'CHAT_REGISTER':
      chatClient.register(event.data.account)
  }
}

self.addEventListener('message', event => {
  console.log('HERE', event)
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// Clean old assets
cleanupOutdatedCaches()

// To allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))
