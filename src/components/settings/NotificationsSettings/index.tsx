import React, { useContext, useEffect, useState } from 'react'
import './NotificationsSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsToggle from '../SettingsToggle/Index'
import MobileHeader from '../../layout/MobileHeader'
import PrivacyIcon from '../../general/Icon/Privacy'
import SettingsContext from '../../../contexts/SettingsContext/context'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import {
  notificationsEnabledInBrowser,
  requireNotifyPermission
} from '../../../utils/notifications'
import NotificationIcon from '../../general/Icon/Notification'
import cn from 'classnames'
import W3iContext from '../../../contexts/W3iContext/context'
import { getDbEchoRegistrations } from '../../../utils/idb'
import { useNotificationPermissionState } from '../../../utils/hooks/notificationHooks'
import Input from '../../general/Input'

const getHelperTooltip = () => {
  switch (Notification?.permission) {
    case 'denied':
      return 'You have explicitly disabled notifications. Please enable them via your browser or system settings'
    case 'granted':
      return 'To disable notifications, use your browser or system settings'
    default:
      return ''
  }
}

const NotificationsSettings: React.FC = () => {
  const { isDevModeEnabled, updateSettings, filterAppDomain } = useContext(SettingsContext)
  const { notifyClientProxy } = useContext(W3iContext)

  const notificationsEnabled = useNotificationPermissionState()

  const [tokenEntries, setTokenEntries] = useState<[IDBValidKey, any][]>([])

  useEffect(() => {
    const getEntries = async () => {
      const [, , , getTokenIdEntries] = await getDbEchoRegistrations()
      const tokenEntries = await getTokenIdEntries()
      if (tokenEntries.length) {
        setTokenEntries(tokenEntries)
      }
    }
    getEntries()
  }, [])

  const handleEnableNotifications = async () => {
    if (!notifyClientProxy) {
      return
    }

    if (await requireNotifyPermission()) {
      await notifyClientProxy.registerWithEcho()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.33 }}
        className="NotificationsSettings"
      >
        <SettingsHeader title="Notifications" />
        <MobileHeader title="Notifications" back="/settings" />
        <div className="NotificationsSettings__wrapper">
          <SettingsItem
            title="Display App on Discover Page"
            subtitle="Provide the domain of your app"
            className="NotificationsSettings__notifications"
          >
            <Input
              value={filterAppDomain}
	      placeholder="app.example.com"
              onChange={ev => updateSettings({ filterAppDomain: ev.target.value })}
            />
          </SettingsItem>

          <div title={getHelperTooltip()}>
            <SettingsItem
              title="Enable Push Notifications"
              subtitle="Get push notifications on your desktop or phone when Web3Inbox is added to your homescreen"
              className={cn(
                'NotificationsSettings__notifications',
                `NotificationsSettings__push-enabled-${notificationsEnabled ? 'true' : 'false'}`
              )}
            >
              <SettingsToggle
                checked={notificationsEnabled}
                setChecked={handleEnableNotifications}
                icon={<NotificationIcon />}
                title="Enable Push Notifications"
                active={notificationsEnabledInBrowser() && !notificationsEnabled}
              />
            </SettingsItem>
          </div>

          <div className="NotificationsSettings__debug" style={{opacity: isDevModeEnabled? 1 : 0}}>
            {tokenEntries.map(([clientId, fcmToken], idx) => {
              return (
                <div className="NotificationsSettings__debug-row">
                  <span>Entry {idx + 1} </span>
                  <span>
                    <span style={{ fontWeight: 800 }}>ClientId</span>: {JSON.stringify(clientId)}{' '}
                  </span>
                  <span>
                    <span style={{ fontWeight: 800 }}>FCM Token</span>: {JSON.stringify(fcmToken)}{' '}
                  </span>
                </div>
              )
            })}
          </div>

          <SettingsItem
            title="Developer Mode"
            subtitle="Display all projects that enabled Notify API"
            className="NotificationsSettings__notifications"
          >
            <SettingsToggle
              checked={isDevModeEnabled}
              setChecked={isEnabled => updateSettings({ isDevModeEnabled: isEnabled })}
              icon={<PrivacyIcon />}
              title="Display all projects that enabled Notify API"
              active={true}
            />
          </SettingsItem>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationsSettings
