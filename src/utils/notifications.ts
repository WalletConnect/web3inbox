import { NotifyClient } from '@walletconnect/notify-client'
import { getFirebaseToken } from './firebase'
import { SERVICE_WORKER_ACTIONS } from './constants'
import { useContext, useState, useEffect } from 'react'
import W3iContext from '../contexts/W3iContext/context'

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

// trust input completely here
export const setupPushSymkeys = async (subKeys: [[string, string]]) => {
  postMessageToServiceWorkerRegistration({
    type: SERVICE_WORKER_ACTIONS.SET_SUBS_SYMKEYS,
    topicSymkeyEntries: subKeys,
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
