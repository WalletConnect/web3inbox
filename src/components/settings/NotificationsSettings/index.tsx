import React, { useContext } from 'react'
import './NotificationsSettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsToggle from '../SettingsToggle/Index'
import MobileHeader from '../../layout/MobileHeader'
// import IncomingIcon from '../../general/Icon/IncomingIcon'
// import OutgoingIcon from '../../general/Icon/OutgoingIcon'
// import NewMessageIcon from '../../general/Icon/NewMessageIcon'
import PrivacyIcon from '../../general/Icon/Privacy'
import SettingsContext from '../../../contexts/SettingsContext/context'

const NotificationsSettings: React.FC = () => {
  const { isDevModeEnabled, updateSettings } = useContext(SettingsContext)

  return (
    <div className="NotificationsSettings">
      <SettingsHeader title="Notifications" />
      <MobileHeader title="Notifications" back="/settings" />
      <div className="NotificationsSettings__wrapper">
        {/* <SettingsItem
          title="Notify me about"
          subtitle="Select about which events you want to be notified."
          className="NotificationsSettings__notifications"
        >
          <SettingsToggle icon={<IncomingIcon />} title="Incoming contact requests" active={true} />
          <SettingsToggle icon={<OutgoingIcon />} title="Outgoing contact requests" active={true} />
          <SettingsToggle icon={<NewMessageIcon />} title="New messages" active={true} />
        </SettingsItem> */}
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
