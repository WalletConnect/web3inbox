import React, { useContext, useEffect, useState } from 'react'

import { useWeb3InboxClient } from '@web3inbox/react'
import cn from 'classnames'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

import Button from '@/components/general/Button'
import NotificationIcon from '@/components/general/Icon/Notification'
import PrivacyIcon from '@/components/general/Icon/Privacy'
import Input from '@/components/general/Input'
import MobileHeader from '@/components/layout/MobileHeader'
import SettingsContext from '@/contexts/SettingsContext/context'
import { getFirebaseToken } from '@/utils/firebase'
import { useNotificationPermissionState } from '@/utils/hooks/notificationHooks'
import { getDbEchoRegistrations } from '@/utils/idb'
import {
  notificationsAvailableInBrowser,
  requireNotifyPermission,
  userEnabledNotification
} from '@/utils/notifications'
import { showSuccessMessageToast } from '@/utils/toasts'

import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsToggle from '../SettingsToggle/Index'

import './NotificationsSettings.scss'

const getHelperTooltip = () => {
  switch (window.Notification?.permission) {
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
  const [domain, setDomain] = useState(filterAppDomain)

  const canSave = domain !== filterAppDomain

  const notificationsEnabled = useNotificationPermissionState()

  const [tokenEntries, setTokenEntries] = useState<[IDBValidKey, any][]>([])

  const { data: client } = useWeb3InboxClient()

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
    if (client && (await requireNotifyPermission())) {
      const token = await getFirebaseToken()
      if (token) {
        await client.registerWithPushServer(token)
      }
    }
  }

  const handleClearDomain = () => {
    setDomain('')
    updateSettings({ filterAppDomain: '' })
    showSuccessMessageToast('Configurations saved')
  }

  const handleSaveDomain = () => {
    updateSettings({ filterAppDomain: domain })
    showSuccessMessageToast('Configurations saved')
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
        <div className="NotificationsSettings__content">
          <div className="NotificationsSettings__content__container">
            <SettingsItem
              title="Display App on Discover Page"
              subtitle="Provide the domain of your app"
              className="NotificationsSettings__notifications"
            >
              <div className="NotificationsSettings__content__container__form">
                <Input
                  value={domain}
                  placeholder="app.example.com"
                  onChange={ev => setDomain(ev.target.value)}
                  tabIndex={1}
                />
                <div className="NotificationsSettings__content__container__form__buttons">
                  <Button
                    disabled={domain === ''}
                    onClick={handleClearDomain}
                    customType="outline"
                    tabIndex={3}
                  >
                    Clear
                  </Button>
                  <Button disabled={!canSave} onClick={handleSaveDomain} tabIndex={2}>
                    Save
                  </Button>
                </div>
              </div>
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
                  active={notificationsAvailableInBrowser() && !notificationsEnabled}
                />
              </SettingsItem>
            </div>

            {tokenEntries?.length ? (
              <div
                className="NotificationsSettings__debug"
                style={{ opacity: isDevModeEnabled ? 1 : 0 }}
              >
                {tokenEntries.map(([clientId, fcmToken], idx) => {
                  return (
                    <div className="NotificationsSettings__debug-row">
                      <span>Entry {idx + 1} </span>
                      <span>
                        <span style={{ fontWeight: 800 }}>ClientId</span>:{' '}
                        {JSON.stringify(clientId)}{' '}
                      </span>
                      <span>
                        <span style={{ fontWeight: 800 }}>FCM Token</span>:{' '}
                        {JSON.stringify(fcmToken)}{' '}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : null}

            <SettingsItem
              title="Developer Mode"
              subtitle="Enable developer mode"
              className="NotificationsSettings__notifications"
            >
              <SettingsToggle
                checked={isDevModeEnabled}
                setChecked={isEnabled => updateSettings({ isDevModeEnabled: isEnabled })}
                icon={<PrivacyIcon />}
                title="Display tokens for debugging"
                active={true}
              />
            </SettingsItem>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationsSettings
