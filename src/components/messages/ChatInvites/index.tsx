import React, { useCallback, useContext, useEffect, useState } from 'react'
import ChatContext from '../../../contexts/ChatContext/context'
import WavingHand from '../../../assets/WavingHand.png'
import CrossIcon from '../../../assets/Cross.svg'
import PeerAndMessage from '../PeerAndMessage'
import './Invites.scss'
import Button from '../../general/Button'
import Checkbox from '../../general/Checkbox'
import CheckIcon from '../../general/Icon/CheckIcon'

const ChatInvites: React.FC = () => {
  const [invitesSelected, setInvitesSelected] = useState<number[]>([])
  const { chatClientProxy, invites, refreshThreadsAndInvites } = useContext(ChatContext)

  useEffect(() => {
    refreshThreadsAndInvites()
  }, [refreshThreadsAndInvites])

  const handleAcceptInvite = useCallback(() => {
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
  }, [invitesSelected, invites, chatClientProxy, refreshThreadsAndInvites, setInvitesSelected])

  const handleDeclineInvite = useCallback(() => {
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
  }, [invitesSelected, chatClientProxy, invites])

  const onCheck = useCallback(
    (checkedInviteId?: number) => {
      if (checkedInviteId) {
        setInvitesSelected(currentSelected => [...currentSelected, checkedInviteId])
      }
    },
    [setInvitesSelected]
  )

  const onUncheck = useCallback(
    (unCheckedInviteId?: number) => {
      if (unCheckedInviteId) {
        setInvitesSelected(currentSelected =>
          currentSelected.filter(inviteId => inviteId !== unCheckedInviteId)
        )
      }
    },
    [setInvitesSelected]
  )

  const onAccept = useCallback(
    (inviteId?: number) => {
      chatClientProxy?.accept({ id: inviteId ?? 0 }).then(refreshThreadsAndInvites)
    },
    [chatClientProxy, refreshThreadsAndInvites]
  )

  const onReject = useCallback(
    (inviteId?: number) => {
      chatClientProxy?.reject({ id: inviteId ?? 0 }).then(refreshThreadsAndInvites)
    },
    [chatClientProxy, refreshThreadsAndInvites]
  )

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
          <Button onClick={handleAcceptInvite} type="action" className="Invites__accept">
            <CheckIcon />
            Accept {invitesSelected.length === 0 ? 'All' : ''}
          </Button>
          <Button onClick={handleDeclineInvite} type="action" className="Invites__decline">
            <img src={CrossIcon} alt="Decline" />
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
                  onCheck={() => onCheck(invite.id)}
                  onUncheck={() => onUncheck(invite.id)}
                  id={invite.id ?? 0}
                  name="inviter"
                />
                <PeerAndMessage
                  key={invite.publicKey}
                  peer={invite.account}
                  message={invite.message}
                />
              </div>
              <div className="Invites__inviter-actions">
                <Button type="action-icon" onClick={() => onAccept(invite.id)}>
                  <CheckIcon />
                </Button>
                <Button type="action-icon" onClick={() => onReject(invite.id)}>
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
