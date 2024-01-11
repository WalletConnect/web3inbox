import React, { useState } from 'react'

import NavLink from '@/components/general/NavLink'
import PeerAndMessage from '@/components/messages/PeerAndMessage'

import './Thread.scss'

interface ThreadProps {
  threadPeer: string
  searchQuery?: string
  lastMessage?: string
  lastMessageTimestamp?: number
  topic: string
}

const Thread: React.FC<ThreadProps> = ({
  topic,
  lastMessage,
  lastMessageTimestamp,
  searchQuery,
  threadPeer
}) => {
  const [calculatedLastMessage] = useState<string | undefined>()
  const [calculatedLastMsgTimestamp] = useState<number | undefined>()

  return (
    <NavLink to={`/messages/chat/${threadPeer}?topic=${topic}`}>
      <PeerAndMessage
        highlightedText={searchQuery}
        peer={threadPeer}
        message={lastMessage ?? calculatedLastMessage}
        timestamp={lastMessageTimestamp ?? calculatedLastMsgTimestamp}
      />
    </NavLink>
  )
}

export default Thread
