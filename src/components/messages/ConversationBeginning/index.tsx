import React from 'react'
import { truncate } from '../../../utils/string'
import Avatar from '../../account/Avatar'
import './ConversationBeginning.scss'

interface IConversationBeginningProps {
  peerAddress: `0x${string}`
  ensName?: string | null
}
const ConversationBeginning: React.FC<IConversationBeginningProps> = ({ peerAddress, ensName }) => {
  return (
    <div className="ConversationBeginning">
      <Avatar address={peerAddress} width="4em" height="4em" />
      <div className="ConversationBeginning__peer">{ensName ?? truncate(peerAddress, 8)}</div>
      <span className="ConversationBeginning__beginning">
        This is the beginning of your encrypted chat.
      </span>
    </div>
  )
}

export default ConversationBeginning
