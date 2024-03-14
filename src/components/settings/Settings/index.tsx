import React, { useCallback, useContext, useState } from 'react'

import cn from 'classnames'

import ArtistPalette from '@/assets/ArtistPalette.png'
import ColoredNotificationBell from '@/assets/ColoredNotificationBell.png'
import DarkCity from '@/assets/DarkCity.png'
import HalfHalfCity from '@/assets/HalfHalfCity.png'
import LightCity from '@/assets/LightCity.png'
import IconWrapper from '@/components/general/Icon/IconWrapper/IconWrapper'
import type { SettingsContextSimpleState } from '@/contexts/SettingsContext/context'
// eslint-disable-next-line no-duplicate-imports
import SettingsContext from '@/contexts/SettingsContext/context'
import { useModals } from '@/utils/hooks'

import './Settings.scss'
import { useWeb3InboxClient } from '@web3inbox/react'

const themeModes: { id: SettingsContextSimpleState['mode']; icon: string }[] = [
  { id: 'light', icon: LightCity },
  { id: 'dark', icon: DarkCity },
  { id: 'system', icon: HalfHalfCity }
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
  const { mode, updateSettings } = useContext(SettingsContext)
  const { isContactModalOpen } = useModals()
  const [mutedContacts, setMutedContacts] = useState<{ topic: string; address: string }[]>([])

  const handleThemeChange = useCallback(
    (modeId: SettingsContextSimpleState['mode']) => {
      updateSettings({ mode: modeId })
      // Can't set `mode` directly due it being able to be 'system'
      // setThemeMode(mode === 'dark' ? 'dark' : 'light')

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (localStorage) {
        localStorage.setItem('w3i-theme', 'light')
      }
    },
    [updateSettings]
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
              onClick={() => {
                if (id === 'light') {
                  handleThemeChange(id)
                }
              }}
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
          <IconWrapper shape="square" bgColor="blue">
            <img src={ColoredNotificationBell} alt="coloredNotification-icon" />
          </IconWrapper>
          <span>Notifications</span>
        </div>
        <div className="Settings__section-settings">
          <div className="Settings__section-subtitle">Developer Mode</div>
          <div className="Settings__setting">
            <div className="Settings__toggle-label">
              Display all projects that enabled Notify API
            </div>
            {/* <Toggle
              name="devMode"
              id="incoming"
              checked={isDevModeEnabled}
              setChecked={isEnabled => updateSettings({ isDevModeEnabled: isEnabled })}
            /> */}
          </div>
          {/* <div className="Settings__section-subtitle">Notify me about...</div>
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
          </div> */}
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
