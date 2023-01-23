import React, { useContext } from 'react'
import DarkCity from '../../../assets/DarkCity.png'
import LightCity from '../../../assets/LightCity.png'
import HalfHalfCity from '../../../assets/HalfHalfCity.png'
import './Settings.scss'
import Radio from '../../general/Radio'
import cn from 'classnames'
import Toggle from '../../general/Toggle'
import type { SettingsContextSimpleState } from '../../../contexts/SettingsContext/context'
import SettingsContext from '../../../contexts/SettingsContext/context'

const themeModes: { id: SettingsContextSimpleState['mode']; icon: string }[] = [
  { id: 'light', icon: LightCity },
  { id: 'dark', icon: DarkCity },
  { id: 'system', icon: HalfHalfCity }
]

const newContactModes: { id: SettingsContextSimpleState['newContacts']; label: string }[] = [
  { id: 'require-invite', label: 'Require new contacts to send me a chat invite' },
  { id: 'reject-new', label: 'Decline all chat invites from new contacts' },
  { id: 'accept-new', label: 'Accept all chat invites from new contacts' }
]

const Settings: React.FC = () => {
  const { mode, newContacts, updateSettings: updateTheme } = useContext(SettingsContext)

  return (
    <div className="Settings">
      <div className="Settings__section Settings__appearance">
        <div className="Settings__section-title">
          <span>Appearance</span>
        </div>
        <div className="Settings__section-settings">
          {themeModes.map(({ id, icon }) => (
            <div
              key={id}
              onClick={() => updateTheme({ mode: id })}
              className={cn('Settings__theme-selector', {
                'Settings__theme-selector-active': mode === id
              })}
            >
              <img src={icon} alt={id} />
              <span>{id}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="Settings__section Settings__notifications">
        <div className="Settings__section-title">
          <span>Notifications</span>
        </div>
        <div className="Settings__section-settings">
          <div className="Settings__section-subtitle">Notify me about...</div>
          <div className="Settings__toggle-setting">
            <div className="Settings__toggle-label">Incoming contact requests</div>
            <Toggle name="incoming" id="incoming" />
          </div>
          <div className="Settings__toggle-setting">
            <div className="Settings__toggle-label">Outgoing contact requests</div>
            <Toggle name="outgoing" id="outgoing" />
          </div>
          <div className="Settings__toggle-setting">
            <div className="Settings__toggle-label">New Messages</div>
            <Toggle name="new-messages" id="new-messages" />
          </div>
        </div>
      </div>
      <div className="Settings__section Settings__contacts">
        <div className="Settings__section-title">
          <span>Contacts</span>
        </div>
        <div className="Settings__section-settings">
          <div className="Settings__section-subtitle">New Contacts</div>
          {newContactModes.map(({ id, label }) => (
            <Radio
              name="new-contacts"
              id={id}
              key={id}
              label={label}
              checked={newContacts === id}
              onCheck={() => updateTheme({ newContacts: id })}
            />
          ))}
        </div>
      </div>
      <div className="Settings__section Settings_crypto">
        <div className="Settings__section-title">
          <span>Crypto</span>
        </div>
      </div>
    </div>
  )
}

export default Settings
