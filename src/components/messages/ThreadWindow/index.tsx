import type { ChatClientTypes } from '@walletconnect/chat-client'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useEnsName } from 'wagmi'
import W3iContext from '../../../contexts/W3iContext/context'
import Avatar from '../../account/Avatar'
import ConversationBeginning from '../ConversationBeginning'
import Message from '../Message'
import MessageBox from '../MessageBox'
import './ThreadWindow.scss'

const ThreadWindow: React.FC = () => {
  const { peer } = useParams<{ peer: string }>()
  const peerAddress = (peer?.split(':')[2] ?? `0x`) as `0x${string}`
  const [topic, setTopic] = useState('')
  const { search } = useLocation()
  const { data: ensName } = useEnsName({ address: peerAddress })
  const { chatClientProxy, userPubkey } = useContext(W3iContext)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesEndRef, messages])

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
        <ConversationBeginning peerAddress={peerAddress} />
        {messages.map((message, i) => {
          const isFirstMessage = i === 0
          const prevMessage = !isFirstMessage && messages[i - 1]
          const currentDate = new Date(message.timestamp)
          const isDifferentDay =
            prevMessage && new Date(prevMessage.timestamp).getDate() !== currentDate.getDate()
          const showDateTag = isFirstMessage || isDifferentDay

          return messages.length === i + 1 ? (
            <div ref={messagesEndRef}>
              {showDateTag && <span>{currentDate.toDateString()}</span>}
              <Message
                key={message.timestamp}
                text={message.message}
                from={message.authorAccount === peer ? 'peer' : 'sender'}
              />
            </div>
          ) : (
            <div>
              {showDateTag && <span>{currentDate.toDateString()}</span>}
              <Message
                key={message.timestamp}
                text={message.message}
                from={message.authorAccount === peer ? 'peer' : 'sender'}
              />
            </div>
          )
        })}
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
