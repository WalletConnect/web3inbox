import React from 'react'

import Avatar from '@/components/account/Avatar'
import Text from '@/components/general/Text'
import { truncate } from '@/utils/string'

import './ConversationBeginning.scss'

interface IConversationBeginningProps {
  peerAddress: `0x${string}`
  ensName?: string | null
}
const ConversationBeginning: React.FC<IConversationBeginningProps> = ({ peerAddress, ensName }) => {
  return (
    <div className="ConversationBeginning">
      <Avatar address={peerAddress} width="4em" height="4em" />
      <div className="ConversationBeginning__peer">
        <Text variant="large-500"> {ensName ?? truncate(peerAddress, 5)}</Text>
      </div>
      <span className="ConversationBeginning__beginning">
        <Text variant="small-500"> This is the beginning of your encrypted chat.</Text>
      </span>
    </div>
  )
}

export default ConversationBeginning
