import React, { useContext, useEffect, useState } from 'react'
import W3iContext from '../../../contexts/W3iContext/context'
import { contactsModalService } from '../../../utils/store'
import { Modal } from '../../general/Modal/Modal'
import PeerAndMessage from '../../messages/PeerAndMessage'

interface ContactsModalProps {
  status: 'blocked' | 'muted'
}

const ContactsModal: React.FC<ContactsModalProps> = ({ status }) => {
  const { chatClientProxy, threads } = useContext(W3iContext)
  const [mutedContacts, setMutedContacts] = useState<{ topic: string; address: string }[]>([])

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
          .filter(contact => Boolean(contact))
      )
    })
  }, [chatClientProxy, threads])

  return (
    <Modal onToggleModal={contactsModalService.toggleModal}>
      <div className="ContactsModal">
        <div className="ContactsModal__title">{status} contacts</div>
        <div className="ContactsModal__search"></div>
        <div className="ContactsModal__contacts">
          {mutedContacts.map(contact => (
            <div className="ContactsModal__contact">
              <PeerAndMessage peer={contact.address} message="" withAvatar={true} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default ContactsModal
