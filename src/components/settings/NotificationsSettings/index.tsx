import React from 'react'
import './NotificationsSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsToggle from '../SettingsToggle/Index'
import MobileHeader from '../../layout/MobileHeader'
import IncomingIcon from '../../general/Icon/IncomingIcon'
import OutgoingIcon from '../../general/Icon/OutgoingIcon'
import NewMessageIcon from '../../general/Icon/NewMessageIcon'

const NotificationsSettings: React.FC = () => {
  return (
    <div className="NotificationsSettings">
      <SettingsHeader title="Notifications" />
      <MobileHeader title="Notifications" back="/settings" />
      <div className="NotificationsSettings__wrapper">
        <SettingsItem
          title="Notify me about"
          subtitle="Select about which events you want to be notified."
          className="NotificationsSettings__notifications"
        >
          <SettingsToggle icon={<IncomingIcon />} title="Incoming contact requests" active={true} />
          <SettingsToggle icon={<OutgoingIcon />} title="Outgoing contact requests" active={true} />
          <SettingsToggle icon={<NewMessageIcon />} title="New messages" active={true} />
        </SettingsItem>
      </div>
    </div>
  )
}

export default NotificationsSettings
