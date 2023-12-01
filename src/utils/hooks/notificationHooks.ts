import { useEffect, useState } from 'react'

import { userEnabledNotification } from '@/utils/notifications'

export const useNotificationPermissionState = () => {
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(
    userEnabledNotification()
  )

  // Can not use navigator.permissions.query({name: 'notifications'}) as it won't work on most
  // mobile browsers

  useEffect(() => {
    const permissionInterval = setInterval(() => {
      if (userEnabledNotification()) {
        setNotificationPermissionGranted(true)
        clearInterval(permissionInterval)
      }
    }, 100)

    return () => clearInterval(permissionInterval)
  }, [])

  return notificationPermissionGranted
}
