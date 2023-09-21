import React from 'react'
import './AppearanceSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsThemeButton from '../SettingsThemeButton'
import SunIcon from '../../general/Icon/SunIcon'
import MoonIcon from '../../general/Icon/MoonIcon'
import SystemIcon from '../../general/Icon/SystemIcon'
import MobileHeader from '../../layout/MobileHeader'

const AppearanceSettings: React.FC = () => {
  return (
    <div className="AppearanceSettings">
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
    </div>
  )
}

export default AppearanceSettings
