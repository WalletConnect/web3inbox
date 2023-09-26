import React, { useState } from 'react'
import NavLink from '../../../general/NavLink'
import PeerAndMessage from '../../PeerAndMessage'
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

  /*
   * UseEffect(() => {
   *   if (!calculatedLastMessage && !lastMessage) {
   *     chatClientProxy?.getMessages({ topic }).then(messages => {
   *       if (messages.length) {
   *         setCalculatedLastMessage(messages[messages.length - 1].message)
   *         setCalculatedLastMsgTimestamp(messages[messages.length - 1].timestamp)
   *       }
   *     })
   *   }
   * }, [chatClientProxy, calculatedLastMessage, lastMessage, setCalculatedLastMessage])
   */

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
