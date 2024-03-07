import { NotifyClient } from '@walletconnect/notify-client'
import { Web3InboxClient } from '@web3inbox/core'

import { localStorageKeys } from '@/constants/localStorage'
import { LocalStorage } from '@/utils/localStorage'
import { notificationPwaModalService } from '@/utils/store'

import { getFirebaseToken } from './firebase'
import { getDbSymkeyStore } from './idb'

const setupSubscriptionSymkey = async (topic: string, symkey: string) => {
  const [, putSymkey] = await getDbSymkeyStore()

  await putSymkey(topic, symkey)
}

export const setupSubscriptionsSymkeys = async (topicSymkeyEntries: [string, string][]) => {
  for (const [topic, symkey] of topicSymkeyEntries) {
    setupSubscriptionSymkey(topic, symkey)
  }
}

export const closeNotificationModal = () => {
  LocalStorage.set(localStorageKeys.notificationModalClosed, 'true')
  notificationPwaModalService.closeModal()
}

export const checkIfNotificationModalClosed = () => {
  const storageValue = LocalStorage.get(localStorageKeys.notificationModalClosed)
  return storageValue === 'true'
}

export const notificationsAvailableInBrowser = () => {
  return 'Notification' in window
}

export const userEnabledNotification = () => {
  if (notificationsAvailableInBrowser()) {
    return window.Notification?.permission === 'granted'
  }
  return false
}

/*
 * Trigger notification dialogue if supported
 * Returns true if permissions were granted
 */
export const requireNotifyPermission = async () => {
  if (!notificationsAvailableInBrowser()) {
    console.warn('This browser does not support desktop push notifications')
    return false
  }

  // No need to explicitly check for Notifications here since
  // the above check ensures it exists
  switch (window.Notification?.permission) {
    case 'granted':
      return true
    case 'denied':
      console.warn('User denied permissions')
      return false
    default:
      const isSecureContext = window.location.protocol === 'https:'

      if (!isSecureContext) {
        throw new Error(
          'Cannot set up notification in unsecure context. Expected protocol to be https:'
        )
      }

      return (await window.Notification?.requestPermission()) === 'granted'
  }
}

export const registerWithEcho = async (client: Web3InboxClient) => {
  if (await requireNotifyPermission()) {
    const token = await getFirebaseToken()

    await client.registerWithPushServer(token, 'fcm')
  }
}
