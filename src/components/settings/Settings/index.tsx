import {useWeb3ModalTheme} from '@web3modal/react'
import cn from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ArtistPalette from '../../../assets/ArtistPalette.png'
// Import ColoredNotificationBell from '../../../assets/ColoredNotificationBell.png'
import DarkCity from '../../../assets/DarkCity.png'
import HalfHalfCity from '../../../assets/HalfHalfCity.png'
import Handshake from '../../../assets/Handshake.png'
import LightCity from '../../../assets/LightCity.png'
import MoneyWithWings from '../../../assets/MoneyWithWings.png'
import type { SettingsContextSimpleState } from '../../../contexts/SettingsContext/context'
// eslint-disable-next-line no-duplicate-imports
import SettingsContext from '../../../contexts/SettingsContext/context'
import W3iContext from '../../../contexts/W3iContext/context'
import { useModals } from '../../../utils/hooks'
import { contactsModalService } from '../../../utils/store'
import CircleBadge from '../../general/Badge/CircleBadge'
import ArrowRightIcon from '../../general/Icon/ArrowRightIcon'
import IconWrapper from '../../general/Icon/IconWrapper/IconWrapper'
import Radio from '../../general/Radio'
import ContactsModal from '../ContactsModal'
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
  const { mode, newContacts, updateSettings } = useContext(SettingsContext)
  const { isContactModalOpen } = useModals()
  const { chatClientProxy, threads } = useContext(W3iContext)
  const [mutedContacts, setMutedContacts] = useState<{ topic: string; address: string }[]>([])

	const { setTheme } = useWeb3ModalTheme()

  const handleThemeChange = useCallback(
    (modeId: SettingsContextSimpleState['mode']) => {
      updateSettings({ mode: modeId })
			// Can't set `mode` directly due it being able to be 'system'
			setTheme({
				themeMode: mode === 'dark' ? "dark" : "light"
			})
			
      localStorage.setItem('w3i-theme', modeId)
    },
    [updateSettings]
  )

  useEffect(() => {
    if (!chatClientProxy) {
      return
    }

    chatClientProxy.getMutedContacts().then(mContacts => {
      setMutedContacts(
        mContacts
          .filter(mutedContact => {
            const address = threads.find(t => t.topic === mutedContact)?.peerAccount

            return Boolean(address)
          })
          .map(mutedContact => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const address = threads.find(t => t.topic === mutedContact)!.peerAccount

            return { address, topic: mutedContact }
          })
      )
    })
  }, [chatClientProxy, threads])

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
              onCheck={() => updateSettings({ newContacts: id })}
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
          <div
            className="Settings__setting"
            onClick={() => {
              chatClientProxy?.getMutedContacts().then(({ length }) => {
                if (length) {
                  contactsModalService.openModal()
                }
              })
            }}
          >
            <div>Muted contacts</div>
            <div className="Settings__toggle-dropdown">
              <CircleBadge>{mutedContacts.length}</CircleBadge>
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
      {isContactModalOpen && (
        <ContactsModal
          status="muted"
          mutedContacts={mutedContacts}
          setMutedContacts={setMutedContacts}
        />
      )}
    </div>
  )
}

export default Settings
