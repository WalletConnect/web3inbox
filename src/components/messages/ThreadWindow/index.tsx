import type { ChatClientTypes } from '@walletconnect/chat-client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useEnsName } from 'wagmi'
import W3iContext from '../../../contexts/W3iContext/context'
import { truncate } from '../../../utils/string'
import Avatar from '../../account/Avatar'
import BackButton from '../../general/BackButton'
import InviteMessage from '../InviteMessage'
import ConversationBeginning from '../ConversationBeginning'
import { MessageItem } from '../Message/MessageItem'
import MessageBox from '../MessageBox'
import './ThreadWindow.scss'
import { noop } from 'rxjs'

const ThreadWindow: React.FC = () => {
  const { peer } = useParams<{ peer: string }>()
  const peerAddress = (peer?.split(':')[2] ?? `0x`) as `0x${string}`
  const [topic, setTopic] = useState('')
  const { search } = useLocation()
  const { data: ensName } = useEnsName({ address: peerAddress })
  const { chatClientProxy, userPubkey, sentInvites } = useContext(W3iContext)

  const [messages, setMessages] = useState<ChatClientTypes.Message[]>([])

  const isInvite =
    topic.includes('invite:') || Boolean(sentInvites.find(invite => invite.inviteeAccount === peer))
  const inviteStatus = topic.includes('invite:')
    ? (topic.split(':')[1] as Omit<ChatClientTypes.SentInvite['status'], 'accepted'>)
    : 'accepted'

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
      return noop
    }
    const sub = chatClientProxy.observe('chat_message', {
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

    return () => sub.unsubscribe()
  }, [chatClientProxy, refreshMessages, topic])

  useEffect(() => {
    refreshMessages()
  }, [refreshMessages, chatClientProxy])

  return (
    <div className="ThreadWindow">
      <div className="ThreadWindow__peer">
        <BackButton backTo="/messages" />
        <Avatar address={peerAddress} width="1.25em" height="1.25em" />
        <span>{ensName ?? truncate(peer ?? '', 10)}</span>
      </div>
      <div className="ThreadWindow__messages">
        <ConversationBeginning peerAddress={peerAddress} ensName={ensName} />
        {isInvite && <InviteMessage peer={peerAddress} status={inviteStatus} />}
        {messages.map((message, i) => (
          <MessageItem
            key={message.timestamp}
            message={message}
            index={i}
            peer={peer}
            messages={messages}
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
