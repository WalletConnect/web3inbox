/// <reference lib="WebWorker" />

declare let self: ServiceWorkerGlobalScope

declare const __VITE_PROJECT_ID__: string

import { SERVICE_WORKER_ACTIONS } from './utils/constants'
import { getDbEchoRegistrations, getDbSymkeyStore } from './utils/idb'

const ECHO_URL = 'https://echo.walletconnect.com'

const registerWithEcho = async (clientId: string, token: string) => {
  const [getRegistrationToken, putRegistrationToken] = await getDbEchoRegistrations()

  // Check for existing registration to prevent spamming echo
  const existingRegistrationToken = await getRegistrationToken(clientId)

  // Already registered device.
  // No need to spam echo
  if (existingRegistrationToken === token) {
    // DO not check for existing registration token.
    // Echo is meant to be called repeatedly to refresh PN token
    console.log(
      'main-sw > registerWithEcho > user already registered with token',
      token,
      're-registering anyway'
    )
  }

  // coming from `define` in vite.config.js
  const projectId = __VITE_PROJECT_ID__

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

  // Is a 200 type response. Redirects (300s) shouldn't occur
  if (echoResponse.status >= 200 && echoResponse.status < 300) {
    // Store info to prevent re-registration
    await putRegistrationToken(clientId, token)
  }
}

const setupSubscriptionSymkey = async (topic: string, symkey: string) => {
  const [, putSymkey] = await getDbSymkeyStore()

  await putSymkey(topic, symkey)
}

const setupSubscriptionsSymkeys = async (topicSymkeyEntries: [string, string][]) => {
  topicSymkeyEntries.forEach(([topic, symkey]) => setupSubscriptionSymkey(topic, symkey))

  for (const [topic, symkey] of topicSymkeyEntries) {
    setupSubscriptionSymkey(topic, symkey)
  }
}

self.addEventListener('message', event => {
  if (!event.data) return

  switch (event.data.type) {
    // Event to install latest service worker when available
    case SERVICE_WORKER_ACTIONS.SKIP_WAITING:
      self.skipWaiting()
      break
    // Event to download symkey into indexedDb and setup the store
    case SERVICE_WORKER_ACTIONS.SET_SUBS_SYMKEYS:
      setupSubscriptionsSymkeys(event.data.topicSymkeyEntries)
      break
    // Event to register with echo
    case SERVICE_WORKER_ACTIONS.REGISTER_WITH_ECHO:
      registerWithEcho(event.data.clientId, event.data.token)
      break
  }
})

self.addEventListener('install', () => {
  self.skipWaiting()
})
