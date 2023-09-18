import React from 'react'
import './PrivacySettings.scss'
import SettingsHeader from '../SettingsHeader'
import SettingsItem from '../SettingsItem'
import SettingsToggle from '../SettingsToggle/Index'
import Radio from '../../general/Radio'
import Text from '../../general/Text'
import MobileHeader from '../../layout/MobileHeader'

const radios = [
  { id: 'require-invite', label: 'Require new contacts to send me a chat invite' },
  { id: 'reject-new', label: 'Decline all chat invites from new contacts' },
  { id: 'accept-new', label: 'Accept all chat invites from new contacts' }
]

const PrivacySettings: React.FC = () => {
  return (
    <div className="PrivacySettings">
      <SettingsHeader title="Privacy" />
      <MobileHeader title="Privacy" />
      <div className="PrivacySettings__wrapper">
        <SettingsItem
          title="Read receipts"
          subtitle="Allow others to see when you have read their messages."
        >
          <SettingsToggle
            title="Send read receipts"
            subtitle="You must enable read receipts to see when others have read your messages."
            active={true}
          />
        </SettingsItem>
        <SettingsItem
          title="Message requests"
          subtitle="Choose how you want others to initiate contact with you."
        >
          <div className="PrivacySettings__radios">
            {radios.map(({ id, label }) => (
              <Radio
                name="new-contacts"
                id={id}
                key={id}
                label={label}
                checked={true}
                onCheck={() => {}}
              />
            ))}
            <Text className="PrivacySettings__radios__subtitle" variant="small-500">
              People that want to message you will need to send an invite first that you can accept
              or decline. Think of it as a polite handshake to start the conversation.
            </Text>
          </div>

          <SettingsToggle
            title="Decline new contacts without any transactions onchain"
            subtitle="People with no transaction history will be blocked from contacting you. Enabling this can help weed out spam."
            active={true}
          />
        </SettingsItem>
      </div>
    </div>
  )
}

export default PrivacySettings
