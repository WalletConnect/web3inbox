import React from 'react'
import './AppearanceSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsThemeButton from '../SettingsThemeButton'
import SunIcon from '../../general/Icon/SunIcon'
import MoonIcon from '../../general/Icon/MoonIcon'
import SystemIcon from '../../general/Icon/SystemIcon'
import MobileHeader from '../../layout/MobileHeader'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

const AppearanceSettings: React.FC = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.33 }}
        className="AppearanceSettings"
      >
        <SettingsHeader title="Appearance" />
        <MobileHeader title="Appearance" back="/settings" />
        <div className="AppearanceSettings__wrapper">
          <SettingsItem
            title="Interface theme"
            subtitle="Select how you want Web3Inbox to look."
            className="AppearanceSettings__modes"
          >
            <SettingsThemeButton
              title="Light"
              subtitle="For daytime, increased blue light exposure."
              icon={<SunIcon />}
              value="light"
              checked={true}
            />
            <SettingsThemeButton
              title="Dark"
              subtitle="For night time and to reduce eye strain."
              icon={<MoonIcon />}
              value="dark"
              disabled={true}
            />
            <SettingsThemeButton
              title="System"
              subtitle="Handled automatically by your browser or OS."
              icon={<SystemIcon />}
              value="system"
              disabled={true}
            />
          </SettingsItem>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AppearanceSettings
