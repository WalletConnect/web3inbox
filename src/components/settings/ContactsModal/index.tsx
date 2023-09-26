import React, { useCallback, useContext } from 'react'
import capitalize from 'lodash/capitalize'
import SettingsContext from '../../../contexts/SettingsContext/context'
import SearchSvg from '../../../assets/Search.svg'
import { useColorModeValue } from '../../../utils/hooks'
import { contactsModalService } from '../../../utils/store'
import Button from '../../general/Button'
import CrossIcon from '../../general/Icon/CrossIcon'
import { Modal } from '../../general/Modal/Modal'
import PeerAndMessage from '../../messages/PeerAndMessage'
import './ContactsModal.scss'
import Input from '../../general/Input'

interface ContactsModalProps {
  status: 'blocked' | 'muted'
  mutedContacts: { topic: string; address: string }[]
  setMutedContacts: React.Dispatch<
    React.SetStateAction<
      {
        topic: string
        address: string
      }[]
    >
  >
}

const ContactsModal: React.FC<ContactsModalProps> = ({
  status,
  mutedContacts,
  setMutedContacts
}) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  const handleContactAction = useCallback(
    (topic: string) => {
      if (status === 'muted') {
        setMutedContacts(currentlyMutedContacts =>
          currentlyMutedContacts.filter(contacts => topic !== contacts.topic)
        )
      }
    },
    [status]
  )

  return (
    <Modal onToggleModal={contactsModalService.toggleModal}>
      <div className="ContactsModal">
        <div className="ContactsModal__header">
          <h2>{capitalize(status)} contacts</h2>
          <Button
            className="ContactsModal__close"
            customType="action-icon"
            onClick={contactsModalService.closeModal}
          >
            <CrossIcon />
          </Button>
        </div>
        <div className="ContactsModal__content">
          <Input
            type="search"
            placeholder="Search"
            icon={SearchSvg}
            containerClassName="ContactsModal__content__search"
          />
          {mutedContacts.map(contact => (
            <div key={contact.topic} className="ContactsModal__content__contact">
              <PeerAndMessage peer={contact.address} message="" withAvatar={true} />
              <Button customType="action" onClick={() => handleContactAction(contact.topic)}>
                {status === 'muted' ? 'Unmute' : 'Unblock'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default ContactsModal
