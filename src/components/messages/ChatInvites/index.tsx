import React, { useContext, useEffect, useState } from 'react'
import ChatContext from '../../../contexts/ChatContext/context'
import WavingHand from '../../../assets/WavingHand.png'
import CheckIcon from '../../../assets/Check.svg'
import CrossIcon from '../../../assets/Cross.svg'
import PeerAndMessage from '../PeerAndMessage'
import './Invites.scss'
import Button from '../../general/Button'
import Checkbox from '../../general/Checkbox'

const ChatInvites: React.FC = () => {
  const [invitesSelected, setInvitesSelected] = useState<number[]>([])
  const { chatClientProxy, invites, refreshThreadsAndInvites } = useContext(ChatContext)

  useEffect(() => {
    refreshThreadsAndInvites()
  }, [refreshThreadsAndInvites])

  return (
    <div className="Invites">
      <div className="Invites__header">
        <div className="Invites__header-text">
          <div className="Invites__header-icon">
            <img src={WavingHand} alt="Hand" />
          </div>
          <span>
            {invitesSelected.length > 0
              ? `${invitesSelected.length} Invites Selected`
              : `${invites.length} New Chat Invites`}
          </span>
        </div>
        <div className="Invites__header-actions">
          <Button
            onClick={() => {
              if (invitesSelected.length) {
                invitesSelected.forEach(id => {
                  chatClientProxy?.accept({ id }).then(refreshThreadsAndInvites)
                })
                setInvitesSelected([])
              } else {
                invites.forEach(invite => {
                  if (invite.id) {
                    chatClientProxy?.accept({ id: invite.id }).then(refreshThreadsAndInvites)
                  }
                })
              }
            }}
            type="action"
            className="Invites__accept"
          >
            <img src={CheckIcon} alt="Accept" />
            Accept {invitesSelected.length === 0 ? 'All' : ''}
          </Button>
          <Button
            onClick={() => {
              if (invitesSelected.length) {
                invitesSelected.forEach(id => {
                  chatClientProxy?.reject({ id })
                })
                setInvitesSelected([])
              } else {
                invites.forEach(invite => {
                  if (invite.id) {
                    chatClientProxy?.reject({ id: invite.id })
                  }
                })
              }
            }}
            type="action"
            className="Invites__decline"
          >
            <img src={CrossIcon} alt="Accept" />
            Decline {invitesSelected.length === 0 ? 'All' : ''}
          </Button>
        </div>
      </div>
      <div className="Invites__inviters">
        {invites.map(invite => {
          return (
            <div key={invite.account} className="Invites__inviter">
              <div className="Invites__inviter-selector">
                <Checkbox
                  checked={(invite.id && invitesSelected.includes(invite.id)) || false}
                  onCheck={() => {
                    if (invite.id) {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      setInvitesSelected(currentSelected => [...currentSelected, invite.id!])
                    }
                  }}
                  onUncheck={() =>
                    invite.id &&
                    setInvitesSelected(currentSelected =>
                      currentSelected.filter(inviteId => inviteId !== invite.id)
                    )
                  }
                  id={invite.id ?? 0}
                  name="inviter"
                />
                <PeerAndMessage
                  key={invite.publicKey}
                  peer={invite.publicKey}
                  message={invite.message}
                />
              </div>
              <div className="Invites__inviter-actions">
                <Button
                  type="action-icon"
                  onClick={() =>
                    chatClientProxy?.accept({ id: invite.id ?? 0 }).then(refreshThreadsAndInvites)
                  }
                >
                  <img src={CheckIcon} alt="Accept" />
                </Button>
                <Button
                  type="action-icon"
                  onClick={() =>
                    chatClientProxy?.reject({ id: invite.id ?? 0 }).then(refreshThreadsAndInvites)
                  }
                >
                  <img src={CrossIcon} alt="Accept" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChatInvites
