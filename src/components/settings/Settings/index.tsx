import cn from 'classnames'
import React, { useCallback, useContext } from 'react'
import ArtistPalette from '../../../assets/ArtistPalette.png'
// import ColoredNotificationBell from '../../../assets/ColoredNotificationBell.png'
import DarkCity from '../../../assets/DarkCity.png'
import HalfHalfCity from '../../../assets/HalfHalfCity.png'
import Handshake from '../../../assets/Handshake.png'
import LightCity from '../../../assets/LightCity.png'
import MoneyWithWings from '../../../assets/MoneyWithWings.png'
import type { SettingsContextSimpleState } from '../../../contexts/SettingsContext/context'
// eslint-disable-next-line no-duplicate-imports
import SettingsContext from '../../../contexts/SettingsContext/context'
import CircleBadge from '../../general/Badge/CircleBadge'
import ArrowRightIcon from '../../general/Icon/ArrowRightIcon'
import IconWrapper from '../../general/Icon/IconWrapper/IconWrapper'
import Radio from '../../general/Radio'
// import Select from '../../general/Select/Select'
import Toggle from '../../general/Toggle'
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

/*
 * Const currencyOptions = [
 *   {
 *     label: 'USD',
 *     value: 'USD'
 *   },
 *   {
 *     label: 'ETH',
 *     value: 'ETH'
 *   }
 * ]
 */

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
          <IconWrapper shape="square" bgColor="turquoise">
            <img src={ArtistPalette} alt="appearance-icon" />
          </IconWrapper>

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
      {/* <div className="Settings__section Settings__notifications">
        <div className="Settings__section-title">
          <IconWrapper shape="square" bgColor="blue">
            <img src={ColoredNotificationBell} alt="coloredNotification-icon" />
          </IconWrapper>
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
			*/}
      <div className="Settings__section Settings__contacts">
        <div className="Settings__section-title">
          <IconWrapper shape="square" bgColor="purple">
            <img src={Handshake} alt="contacts-icon" />
          </IconWrapper>
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
          {/*
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
					*/}
          <div className="Settings__setting">
            <div>Muted contacts</div>
            <div className="Settings__toggle-dropdown">
              <CircleBadge>0</CircleBadge>
              <ArrowRightIcon />
            </div>
          </div>
          {/*
          <div className="Settings__setting">
            <div>Blocked contacts</div>
            <div className="Settings__toggle-dropdown">
              <CircleBadge>0</CircleBadge>
              <ArrowRightIcon />
            </div>
          </div>
					*/}
        </div>
      </div>
      {/*
      <div className="Settings__section Settings_crypto">
        <div className="Settings__section-title">
          <IconWrapper shape="square" bgColor="green">
            <img src={MoneyWithWings} alt="money-with-wings-icon" />
          </IconWrapper>
          <span>Crypto</span>
        </div>
        <div className="Settings__section-settings">
          <div className="Settings__setting">
            <div>Currency</div>
            <Select
              name="currency"
              id="currency"
              options={currencyOptions}
              onChange={console.log}
            />
          </div>
        </div>
      </div>*/}
    </div>
  )
}

export default Settings
