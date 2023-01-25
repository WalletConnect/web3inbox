import React, { useCallback, useContext, useEffect, useState } from 'react'
import W3iContext from '../../../contexts/W3iContext/context'
import { useLocation, useParams } from 'react-router-dom'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import './ThreadWindow.scss'
import Message from '../Message'
import MessageBox from '../MessageBox'
import { useEnsName } from 'wagmi'
import Avatar from '../../account/Avatar'

const ThreadWindow: React.FC = () => {
  const { peer } = useParams<{ peer: string }>()
  const peerAddress = (peer?.split(':')[2] ?? `0x`) as `0x${string}`
  const [topic, setTopic] = useState('')
  const { search } = useLocation()
  const { data: ensName } = useEnsName({ address: peerAddress })
  const { chatClientProxy, userPubkey } = useContext(W3iContext)

  const [messages, setMessages] = useState<ChatClientTypes.Message[]>([])

  useEffect(() => {
    setTopic(new URLSearchParams(search).get('topic') ?? '')
  }, [search])

  const refreshMessages = useCallback(() => {
    if (!chatClientProxy || !topic) {
      return
    }

    chatClientProxy
      .getMessages({
        topic
      })
      .then(allChatMessages => {
        setMessages(allChatMessages)
      })
  }, [chatClientProxy, search, setMessages, topic])

  useEffect(() => {
    if (!chatClientProxy) {
      return
    }
    chatClientProxy.observe('chat_message', {
      next: messageEvent => {
        /*
         * Ignore message events from other threads
         * this prevents unnecessary refresh of messages
         * when a message from a different threads arrives
         */
        if (messageEvent.topic !== topic) {
          return
        }

        refreshMessages()
      }
    })
  }, [chatClientProxy, refreshMessages, topic])

  useEffect(() => {
    refreshMessages()
  }, [refreshMessages, chatClientProxy])

  return (
    <div className="ThreadWindow">
      <div className="ThreadWindow__peer">
        <Avatar address={peerAddress} width="1.25em" height="1.25em" />
        <span>{ensName ?? peer}</span>
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
        authorAccount={`eip155:1:${userPubkey ?? ''}`}
        topic={topic}
      />
    </div>
  )
}

export default ThreadWindow
