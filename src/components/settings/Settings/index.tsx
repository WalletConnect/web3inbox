import React, { useContext, useMemo } from 'react'
import DarkCity from '../../../assets/DarkCity.png'
import LightCity from '../../../assets/LightCity.png'
import HalfHalfCity from '../../../assets/HalfHalfCity.png'
import './Settings.scss'
import Radio from '../../general/Radio'
import type { ThemeContextSimpleState } from '../../../contexts/ThemeContext/context'
import ThemeContext from '../../../contexts/ThemeContext/context'
import cn from 'classnames'

const Settings: React.FC = () => {
  const { mode, updateTheme } = useContext(ThemeContext)

  const themeMods: { id: ThemeContextSimpleState['mode']; icon: string }[] = useMemo(() => {
    return [
      { id: 'light', icon: LightCity },
      { id: 'dark', icon: DarkCity },
      { id: 'system', icon: HalfHalfCity }
    ]
  }, [])

  return (
    <div className="Settings">
      <div className="Settings__section Settings__appearance">
        <div className="Settings__section-title">
          <span>Appearance</span>
        </div>
        <div className="Settings__section-settings">
          {themeMods.map(({ id, icon }) => (
            <div
              key={id}
              onClick={() => updateTheme({ mode: id })}
              className={cn('Settings__theme-selector', {
                'Settings__theme-selector-active': mode === id
              })}
            >
              <img src={icon} alt="LightMode" />
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
            <div className="Settings__toggle-radio"></div>
          </div>
          <div className="Settings__toggle-setting">
            <div className="Settings__toggle-label">Outgoing contact requests</div>
            <div className="Settings__toggle-radio"></div>
          </div>
          <div className="Settings__toggle-setting">
            <div className="Settings__toggle-label">New Messages</div>
            <div className="Settings__toggle-radio"></div>
          </div>
        </div>
      </div>
      <div className="Settings__section Settings__contacts">
        <div className="Settings__section-title">
          <span>Contacts</span>
        </div>
        <div className="Settings__section-settings">
          <div className="Settings__section-subtitle">New Contacts</div>
          <Radio
            name="new-contacts"
            id="require-invite"
            label="Require new contacts to send me a chat invite"
          />
          <Radio
            name="new-contacts"
            id="accept-new"
            label="Accept all chat invites from new contacts"
          />
          <Radio
            name="new-contacts"
            id="reject-new"
            label="Decline all chat invites from new contacts"
          />
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
