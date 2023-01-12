import React, { useContext, useState } from 'react'
import ChatContext from '../../../contexts/ChatContext/context'
import WavingHand from '../../../assets/WavingHand.png'
import CheckIcon from '../../../assets/Check.svg'
import CrossIcon from '../../../assets/Cross.svg'
import PeerAndMessage from '../PeerAndMessage'
import './Invites.scss'
import Button from '../../general/Button'

const ChatInvites: React.FC = () => {
  const [invitesSelected] = useState<number[]>([])
  const { chatClientProxy, invites, refreshThreadsAndInvites } = useContext(ChatContext)

  return (
    <div className="Invites">
      <div className="Invites__header">
        <div className="Invites__header-icon">
          <img src={WavingHand} alt="Hand" />
        </div>
        <span>
          {invitesSelected.length > 0
            ? `${invitesSelected.length} Invites Selected`
            : `${invites.length} New Chat Invites`}
        </span>
      </div>
      <div className="Invites__inviters">
        {invites.map(invite => {
          return (
            <div className="Invites__inviter">
              <PeerAndMessage
                key={invite.publicKey}
                peer={invite.publicKey}
                message={invite.message}
              />
              <div className="Invites__inviter-actions">
                <Button
                  type="action"
                  onClick={() =>
                    chatClientProxy?.accept({ id: invite.id ?? 0 }).then(refreshThreadsAndInvites)
                  }
                >
                  <img src={CheckIcon} alt="Accept" />
                </Button>
                <Button
                  type="action"
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
