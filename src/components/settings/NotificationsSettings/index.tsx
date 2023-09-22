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

const NotificationsSettings: React.FC = () => {
  const { isDevModeEnabled, updateSettings } = useContext(SettingsContext)

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
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationsSettings
