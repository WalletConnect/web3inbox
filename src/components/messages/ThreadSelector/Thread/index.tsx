import React, { useContext, useEffect, useState } from 'react'
import { useEnsName } from 'wagmi'
import W3iContext from '../../../../contexts/W3iContext/context'
import { getEthChainAddress } from '../../../../utils/address'
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
  const address = getEthChainAddress(threadPeer)
  const { data: ensName } = useEnsName({ address })

  const [calculatedLastMessage, setCalculatedLastMessage] = useState<string | undefined>()
  const [calculatedLastMsgTimestamp, setCalculatedLastMsgTimestamp] = useState<number | undefined>()
  const { chatClientProxy } = useContext(W3iContext)

  useEffect(() => {
    if (!calculatedLastMessage && !lastMessage) {
      chatClientProxy?.getMessages({ topic }).then(messages => {
        if (messages.length) {
          setCalculatedLastMessage(messages[messages.length - 1].message)
          setCalculatedLastMsgTimestamp(messages[messages.length - 1].timestamp)
        }
      })
    }
  }, [chatClientProxy, calculatedLastMessage, lastMessage, setCalculatedLastMessage])

  return (
    <NavLink to={`/messages/chat/${threadPeer}?topic=${topic}`}>
      <PeerAndMessage
        highlightedText={searchQuery}
        peer={ensName ?? threadPeer}
        message={lastMessage ?? calculatedLastMessage}
        timestamp={lastMessageTimestamp ?? calculatedLastMsgTimestamp}
      />
    </NavLink>
  )
}

export default Thread
