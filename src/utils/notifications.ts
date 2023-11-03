import { NotifyClient } from '@walletconnect/notify-client'
import { getFirebaseToken } from './firebase'
import { SERVICE_WORKER_ACTIONS } from './constants'
import { useState } from 'react'

export const getEchoRegistrationToken = () => {}

export const notificationsEnabledInBrowser = () => {
  return 'Notification' in window
}

export const userEnabledNotification = () => {
  if (notificationsEnabledInBrowser()) {
    return Notification?.permission === 'granted'
  }
  return false
}

export const useNotificationPermissionState = () => {
  const [enabled, setEnabled] = useState(userEnabledNotification())

  navigator.permissions?.query({ name: 'notifications' }).then(permissionStatus => {
    permissionStatus.onchange = () => {
      setEnabled(userEnabledNotification())
    }
  })

  return enabled
}

export const requireNotifyPermission = async () => {
  if (!notificationsEnabledInBrowser()) {
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

const postMessageToServiceWorkerRegistration = async (message: Record<string, any>) => {
  const registration = await navigator.serviceWorker.ready

  if (!registration || !registration.active) {
    throw new Error('No service worker registered and active')
  }

  registration.active.postMessage(message)
}

export const setupPushSymkey = async (notifyClient: NotifyClient, subAppDomain: string) => {
  const sub = Object.values(notifyClient.getActiveSubscriptions()).find(
    sub => sub.metadata.appDomain === subAppDomain
  )

  if (!sub) {
    throw new Error('Invalid sub topic provided, no associated subscription found')
  }

  postMessageToServiceWorkerRegistration({
    type: SERVICE_WORKER_ACTIONS.SET_SUBS_SYMKEYS,
    topic: sub.topic,
    symkey: sub.symKey
  })
}

export const registerWithEcho = async (notifyClient: NotifyClient) => {
  const isSecureContext = window.location.protocol === 'https:'

  if (!isSecureContext) {
    throw new Error('Can not set up notification in unsecure context')
  }

  const clientId = await notifyClient.core.crypto.getClientId()

  const token = await getFirebaseToken()

  postMessageToServiceWorkerRegistration({
    type: SERVICE_WORKER_ACTIONS.REGISTER_WITH_ECHO,
    clientId,
    token
  })
}
