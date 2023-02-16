import React, { useCallback, useContext, useEffect, useState } from 'react'
import CrossIcon from '../../../assets/Cross.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import { useIsMobile } from '../../../utils/hooks'
import BackButton from '../../general/BackButton'
import Button from '../../general/Button'
import Checkbox from '../../general/Checkbox'
import CheckIcon from '../../general/Icon/CheckIcon'
import PeerAndMessage from '../PeerAndMessage'
import ChatInvitesHeader from './ChatInvitesHeader'
import './Invites.scss'

const ChatInvites: React.FC = () => {
  const [invitesSelected, setInvitesSelected] = useState<number[]>([])
  const { chatClientProxy, invites, refreshThreadsAndInvites } = useContext(W3iContext)
  const isMobile = useIsMobile()

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
      <BackButton backTo="/messages">
        <div className="Invites__navigation">Chat</div>
      </BackButton>
      <div className={`Invites__header${isMobile ? '__mobile' : ''}`}>
        <ChatInvitesHeader
          invitesCount={invites.length}
          invitesSelectedCount={invitesSelected.length}
        />

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
            <div key={invite.inviterAccount} className="Invites__inviter">
              <div className="Invites__inviter-selector">
                <Checkbox
                  checked={(invite.id && invitesSelected.includes(invite.id)) || false}
                  onCheck={() => onCheck(invite.id)}
                  onUncheck={() => onUncheck(invite.id)}
                  id={invite.id}
                  name="inviter"
                />
                <PeerAndMessage
                  key={invite.inviterPublicKey}
                  peer={invite.inviterAccount}
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
