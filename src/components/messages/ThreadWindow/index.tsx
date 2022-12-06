import React, { useCallback, useContext, useEffect, useState } from 'react'
import ChatContext from '../../../contexts/ChatContext/context'
import { useLocation, useParams } from 'react-router-dom'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import './ThreadWindow.scss'
import Message from '../Message'
import MessageBox from '../MessageBox'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import Avatar from '../../account/Avatar'

interface ThreadWindowProps {}

const ThreadWindow: React.FC<ThreadWindowProps> = () => {
  const { peer } = useParams<{ peer: string }>()
  const peerAddress = (peer?.split(':')[2] || `0x`) as `0x${string}`
  const [topic, setTopic] = useState('')
  const { address } = useAccount()
  const { search } = useLocation()
  const { data: ensAvatar } = useEnsAvatar({
    address: peerAddress
  })
  const { data: ensName } = useEnsName({ address: peerAddress })
  const { chatClient } = useContext(ChatContext)

  const [messages, setMessages] = useState<ChatClientTypes.Message[]>([])

  console.log('aa', topic)
  useEffect(() => {
    setTopic(new URLSearchParams(search).get('topic') || '')
  }, [search])

  const refreshMessages = useCallback(() => {
    if (!chatClient || !topic) {
      return
    }
    const chatMessages = chatClient.chatMessages.getAll({
      topic
    })[0]

    const threadMessages = chatMessages.messages

    if (threadMessages) {
      setMessages(threadMessages)
    } else {
      setMessages([])
    }
  }, [chatClient, search, setMessages, topic])

  useEffect(() => {
    if (!chatClient) {
      return
    }
    chatClient.on('chat_message', messageEvent => {
      if (messageEvent.topic !== topic) {
        return
      }
      refreshMessages()
    })
  }, [chatClient, refreshMessages, topic])

  useEffect(() => {
    refreshMessages()
  }, [refreshMessages, chatClient])

  return (
    <div className="ThreadWindow">
      <div className="ThreadWindow__peer">
        <Avatar width="1.25em" height="1.25em" src={ensAvatar} />
        <span>{ensName || peer}</span>
      </div>
      <div className="ThreadWindow__messages">
        {messages.map(message => (
          <Message
            key={message.timestamp}
            text={message.message}
            from={message.authorAccount === peer ? 'peer' : 'sender'}
          />
        ))}
      </div>
      <MessageBox
        onSuccessfulSend={refreshMessages}
        authorAccount={`eip155:1:${address}`}
        topic={topic}
      />
    </div>
  )
}

export default ThreadWindow
