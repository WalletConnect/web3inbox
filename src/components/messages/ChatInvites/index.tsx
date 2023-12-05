import React, { useCallback, useContext, useEffect, useState } from 'react'

import CrossIcon from '@/assets/Cross.svg'
import BackButton from '@/components/general/BackButton'
import Button from '@/components/general/Button'
import Checkbox from '@/components/general/Checkbox'
import CheckIcon from '@/components/general/Icon/CheckIcon'
import W3iContext from '@/contexts/W3iContext/context'

import PeerAndMessage from '../PeerAndMessage'
import ChatInvitesHeader from './ChatInvitesHeader'

import './Invites.scss'

const ChatInvites: React.FC = () => {
  const [invitesSelected, setInvitesSelected] = useState<number[]>([])
  const { chatClientProxy, invites, refreshThreadsAndInvites } = useContext(W3iContext)

  useEffect(() => {
    refreshThreadsAndInvites()
  }, [refreshThreadsAndInvites])

  const handleAcceptInvite = useCallback(() => {
    if (invitesSelected.length) {
      Promise.all(
        invitesSelected.map(id => {
          return chatClientProxy?.accept({ id })
        })
      ).then(() => {
        refreshThreadsAndInvites()
        setInvitesSelected([])
      })
    } else {
      Promise.all(
        invites.map(invite => {
          return chatClientProxy?.accept({ id: invite.id })
        })
      ).then(() => {
        refreshThreadsAndInvites()
        setInvitesSelected([])
      })
    }
  }, [invitesSelected, invites, chatClientProxy, refreshThreadsAndInvites, setInvitesSelected])

  const handleDeclineInvite = useCallback(() => {
    if (invitesSelected.length) {
      Promise.all(
        invitesSelected.map(id => {
          return chatClientProxy?.reject({ id })
        })
      ).then(() => {
        refreshThreadsAndInvites()
        setInvitesSelected([])
      })
    } else {
      Promise.all(
        invites.map(({ id }) => {
          return chatClientProxy?.reject({ id })
        })
      ).then(() => {
        refreshThreadsAndInvites()
        setInvitesSelected([])
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
      <div className="Invites__header">
        <ChatInvitesHeader
          invitesCount={invites.filter(({ status }) => status === 'pending').length}
          invitesSelectedCount={invitesSelected.length}
        />

        <div className="Invites__header-actions">
          <Button onClick={handleAcceptInvite} customType="action" className="Invites__accept">
            <CheckIcon />
            Accept {invitesSelected.length === 0 ? 'All' : ''}
          </Button>
          <Button onClick={handleDeclineInvite} customType="action" className="Invites__decline">
            <img src={CrossIcon} alt="Decline" />
            Decline {invitesSelected.length === 0 ? 'All' : ''}
          </Button>
        </div>
      </div>
      <div className="Invites__inviters">
        {invites
          .filter(invite => invite.status === 'pending')
          .map(invite => {
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
                  <Button customType="action-icon" onClick={() => onAccept(invite.id)}>
                    <CheckIcon />
                  </Button>
                  <Button customType="action-icon" onClick={() => onReject(invite.id)}>
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
