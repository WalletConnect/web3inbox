import React, { useCallback, useContext } from 'react'
import cn from 'classnames'
import DarkCity from '../../../assets/DarkCity.png'
import LightCity from '../../../assets/LightCity.png'
import HalfHalfCity from '../../../assets/HalfHalfCity.png'
import Appearance from '../../../assets/Appearance.svg'
import ColoredNotification from '../../../assets/ColoredNotification.svg'
import Contacts from '../../../assets/Contacts.svg'
import Crypto from '../../../assets/Crypto.svg'
import Radio from '../../general/Radio'
import Toggle from '../../general/Toggle'
import type { SettingsContextSimpleState } from '../../../contexts/SettingsContext/context'
import SettingsContext from '../../../contexts/SettingsContext/context'
import CircleBadge from '../../general/Badge/CircleBadge'
import ArrowRightIcon from '../../general/Icon/ArrowRightIcon'
import Select from '../../general/Select/Select'
import './Settings.scss'

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

const currencyOptions = [
  {
    label: 'USD',
    value: 'USD'
  },
  {
    label: 'ETH',
    value: 'ETH'
  }
]

const Settings: React.FC = () => {
  const { mode, newContacts, updateSettings: updateTheme } = useContext(SettingsContext)

  const handleThemeChange = useCallback(
    (modeId: SettingsContextSimpleState['mode']) => {
      updateTheme({ mode: modeId })
      localStorage.setItem('w3i-theme', modeId)
    },
    [updateTheme]
  )

  return (
    <div className="Settings">
      <div className="Settings__section Settings__appearance">
        <div className="Settings__section-title">
          <img src={Appearance} alt="appearance-icon" />
          <span>Appearance</span>
        </div>
        <div className="Settings__section-settings">
          {themeModes.map(({ id, icon }) => (
            <div
              key={id}
              onClick={() => handleThemeChange(id)}
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
          <img src={ColoredNotification} alt="coloredNotification-icon" />
          <span>Notifications</span>
        </div>
        <div className="Settings__section-settings">
          <div className="Settings__section-subtitle">Notify me about...</div>
          <div className="Settings__setting">
            <div className="Settings__toggle-label">Incoming contact requests</div>
            <Toggle name="incoming" id="incoming" />
          </div>
          <div className="Settings__setting">
            <div className="Settings__toggle-label">Outgoing contact requests</div>
            <Toggle name="outgoing" id="outgoing" />
          </div>
          <div className="Settings__setting">
            <div className="Settings__toggle-label">New Messages</div>
            <Toggle name="new-messages" id="new-messages" />
          </div>
        </div>
      </div>
      <div className="Settings__section Settings__contacts">
        <div className="Settings__section-title">
          <img src={Contacts} alt="contacts-icon" />
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
          <div className="Settings__section-helper-text">
            People that want to message you will need to send an invite first that you can accept or
            decline. Think of it as a polite handshake to start the conversation.
          </div>
          <div className="Settings__setting">
            <div className="Settings__toggle-label">
              Decline new contacts without any transactions onchain
            </div>
            <Toggle name="decline-new-contacts" id="decline-new-contacts" />
          </div>
          <div className="Settings__section-helper-text">
            People with no transaction history will be blocked from contacting you. Enabling this
            can help weed out spam.
          </div>
          <div className="Settings__setting">
            <div>Muted contacts</div>
            <div className="Settings__toggle-dropdown">
              <CircleBadge>0</CircleBadge>
              <ArrowRightIcon />
            </div>
          </div>
          <div className="Settings__setting">
            <div>Blocked contacts</div>
            <div className="Settings__toggle-dropdown">
              <CircleBadge>0</CircleBadge>
              <ArrowRightIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="Settings__section Settings_crypto">
        <div className="Settings__section-title">
          <img src={Crypto} alt="crypto-icon" />
          <span>Crypto</span>
        </div>
        <div className="Settings__section-settings">
          <div className="Settings__setting">
            <div>Currency</div>
            <Select
              name="currency"
              id="currency"
              options={currencyOptions}
              onChange={e => console.log(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
