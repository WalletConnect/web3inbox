import React from 'react'
import './NotificationsSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsToggle from '../SettingsToggle/Index'
import MobileHeader from '../../layout/MobileHeader'

const NotificationsSettings: React.FC = () => {
  return (
    <div className="NotificationsSettings">
      <SettingsHeader title="Notifications" />
      <MobileHeader title="Notifications" />
      <div className="NotificationsSettings__wrapper">
        <SettingsItem
          title="Notify me about"
          subtitle="Select about which events you want to be notified."
          className="NotificationsSettings__notifications"
        >
          <SettingsToggle title="Incoming contact requests" active={true} />
          <SettingsToggle title="Outgoing contact requests" active={true} />
          <SettingsToggle title="New messages" active={true} />
        </SettingsItem>
      </div>
    </div>
  )
}

export default NotificationsSettings
