import React, { useContext } from 'react'
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
  requireNotifyPermission,
  useNotificationPermissionState
} from '../../../utils/notifications'
import NotificationIcon from '../../general/Icon/Notification'
import cn from 'classnames'
import W3iContext from '../../../contexts/W3iContext/context'

const NotificationsSettings: React.FC = () => {
  const { isDevModeEnabled, updateSettings } = useContext(SettingsContext)
  const { notifyClientProxy } = useContext(W3iContext)

  const notificationsEnabled = useNotificationPermissionState()

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
          <div
            title={
              notificationsEnabled
                ? 'To disable notifications, use native browser settings next to URL'
                : ''
            }
          >
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
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationsSettings
