import React from 'react'
import Avatar from '../../account/Avatar'
import './ConversationBeginning.scss'

interface IConversationBeginningProps {
  peerAddress: `0x${string}`
}
const ConversationBeginning: React.FC<IConversationBeginningProps> = ({ peerAddress }) => {
  return (
    <div className="ConversationBeginning">
      <Avatar address={peerAddress} width="4em" height="4em" />
      <div className="ConversationBeginning__peer">{peerAddress}</div>
      <span className="ConversationBeginning__beginning">
        This is the beginning of your encrypted chat.
      </span>
    </div>
  )
}

export default ConversationBeginning
