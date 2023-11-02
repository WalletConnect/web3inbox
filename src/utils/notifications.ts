import { NotifyClient } from '@walletconnect/notify-client'
import { getFirebaseToken } from './firebase'

export const requireNotifyPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support desktop push notifications')
  }

  switch (Notification.permission) {
    case 'granted':
      return Promise.resolve()
    case 'denied':
      throw new Error('User denied permissions')
    default:
      if ((await Notification.requestPermission()) === 'granted') {
        return Promise.resolve(new Error('User denied permissions'))
      }
  }
}

export const installSymkeyInServiceWorker = async (
  clientId: string,
  symkey: string,
  vapidToken: string,
  topic: string
) => {
  const registration = await navigator.serviceWorker.ready

  if (!registration || !registration.active) {
    throw new Error('No service worker registered and active')
  }

  registration.active.postMessage({
    type: 'INSTALL_SYMKEY_CLIENT',
    clientId,
    topic,
    token: vapidToken,
    symkey
  })
}

export const setupPushNotifications = async (notifyClient: NotifyClient, subTopic: string) => {
  const isSecureContext = window.location.protocol === 'https://'

  const sub = Object.values(notifyClient.getActiveSubscriptions()).find(
    sub => sub.topic === subTopic
  )

  if (!sub) {
    throw new Error('Invalid sub topic provided, no associated subscription found')
  }

  if (!isSecureContext) {
    throw new Error('Can not set up notification in unsecure context')
  }

  const clientId = await notifyClient.core.crypto.getClientId()

  const token = await getFirebaseToken()

  await installSymkeyInServiceWorker(clientId, sub.symKey, token, subTopic)
}
