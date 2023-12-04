import React from 'react'

import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

import MoonIcon from '@/components/general/Icon/MoonIcon'
import SunIcon from '@/components/general/Icon/SunIcon'
import SystemIcon from '@/components/general/Icon/SystemIcon'
import MobileHeader from '@/components/layout/MobileHeader'
import SettingsHeader from '@/components/settings/SettingsHeader'
import SettingsItem from '@/components/settings/SettingsItem'
import SettingsThemeButton from '@/components/settings/SettingsThemeButton'

import './AppearanceSettings.scss'

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
        <div className="AppearanceSettings__content">
          <div className="AppearanceSettings__content__container">
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
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AppearanceSettings
