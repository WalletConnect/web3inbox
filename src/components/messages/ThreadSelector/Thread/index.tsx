import React, { useContext, useEffect, useState } from 'react'
import { useEnsName } from 'wagmi'
import { getEthChainAddress } from '../../../../utils/address'
import NavLink from '../../../general/NavLink'
import './Thread.scss'
import PeerAndMessage from '../../PeerAndMessage'
import ChatContext from '../../../../contexts/ChatContext/context'

interface ThreadProps {
  threadPeer: string
  searchQuery?: string
  lastMessage?: string
  topic: string
}

const Thread: React.FC<ThreadProps> = ({ topic, lastMessage, searchQuery, threadPeer }) => {
  const address = getEthChainAddress(threadPeer)
  const { data: ensName } = useEnsName({ address })

  const [calculatedLastMessage, setCalculatedLastMessage] = useState<string | undefined>()
  const { chatClientProxy } = useContext(ChatContext)

  useEffect(() => {
    if (!calculatedLastMessage && !lastMessage) {
      chatClientProxy?.getMessages({ topic }).then(messages => {
        if (messages.length) {
          setCalculatedLastMessage(messages[messages.length - 1].message)
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
      />
    </NavLink>
  )
}

export default Thread
