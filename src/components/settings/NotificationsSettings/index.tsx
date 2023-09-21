import React, { useContext } from 'react'
import './NotificationsSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsToggle from '../SettingsToggle/Index'
import MobileHeader from '../../layout/MobileHeader'
import PrivacyIcon from '../../general/Icon/Privacy'
import SettingsContext from '../../../contexts/SettingsContext/context'

const NotificationsSettings: React.FC = () => {
  const { isDevModeEnabled, updateSettings } = useContext(SettingsContext)

  return (
    <div className="NotificationsSettings">
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
    </div>
  )
}

export default NotificationsSettings
