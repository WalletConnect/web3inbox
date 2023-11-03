import { NotifyClient } from '@walletconnect/notify-client'
import { getFirebaseToken } from './firebase'
import { SERVICE_WORKER_ACTIONS } from './constants'
import { useState, useEffect } from 'react'

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
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(
    userEnabledNotification()
  )

  useEffect(() => {
    navigator.permissions?.query({ name: 'notifications' }).then(permissionStatus => {
      permissionStatus.onchange = () => {
        setNotificationPermissionGranted(userEnabledNotification())
      }
    })
  }, [])

  return notificationPermissionGranted
}

/*
 * Trigger notification dialogue if supported
 * Returns true if permissions were granted
 */
export const requireNotifyPermission = async () => {
  if (!notificationsEnabledInBrowser()) {
    console.error('This browser does not support desktop push notifications')
    return false
  }

  switch (Notification.permission) {
    case 'granted':
      return true
    case 'denied':
      console.error('User denied permissions')
      return false
    default:
      return (await Notification.requestPermission()) === 'granted'
  }
}

const postMessageToServiceWorkerRegistration = async (message: Record<string, any>) => {
  const registration = await navigator.serviceWorker.ready

  if (!registration || !registration.active) {
    throw new Error('No service worker registered and active')
  }

  registration.active.postMessage(message)
}

// trust input completely here
export const setupPushSymkeys = async (subKeys: [string, string][]) => {
  postMessageToServiceWorkerRegistration({
    type: SERVICE_WORKER_ACTIONS.SET_SUBS_SYMKEYS,
    topicSymkeyEntries: subKeys
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
