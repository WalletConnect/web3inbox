import type { ChatClientTypes } from '@walletconnect/chat-client'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
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
import { AnimatePresence } from 'framer-motion'
import ThreadDropdown from './ThreadDropdown'

const ThreadWindow: React.FC = () => {
  const { peer } = useParams<{ peer: string }>()
  const peerAddress = (peer?.split(':')[2] ?? `0x`) as `0x${string}`
  const { search } = useLocation()
  const [topic, setTopic] = useState(() => new URLSearchParams(search).get('topic') ?? '')
  const { data: ensName } = useEnsName({ address: peerAddress })
  const { chatClientProxy, userPubkey, threads, sentInvites } = useContext(W3iContext)
  const nav = useNavigate()

  const [messages, setMessages] = useState<ChatClientTypes.Message[]>([])

  const isInvite = useMemo(
    () => topic.includes('invite:') || sentInvites.some(invite => invite.inviteeAccount === peer),
    [topic, sentInvites, peer]
  )
  const inviteStatus: ChatClientTypes.SentInvite['status'] = useMemo(
    () =>
      topic.includes('invite:')
        ? (topic.split(':')[1] as ChatClientTypes.SentInvite['status'])
        : 'approved',
    [topic]
  )

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
      .catch(() => nav('/'))
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

    const inviteAcceptedSub = chatClientProxy.observe('chat_invite_accepted', {
      next: inviteAcceptedEvent => {
        const { inviteeAccount } = inviteAcceptedEvent.params.invite
        if (isInvite && inviteAcceptedEvent.params.invite.inviteeAccount === peer) {
          nav(`/messages/chat/${inviteeAccount}?topic=${inviteAcceptedEvent.params.topic}`)
        }
      }
    })

    const inviteRejectedSub = chatClientProxy.observe('chat_invite_rejected', {
      next: inviteRejectedEvent => {
        if (isInvite && inviteRejectedEvent.params.invite.inviteeAccount === peer) {
          const { inviteeAccount } = inviteRejectedEvent.params.invite
          nav(`/messages/chat/${inviteeAccount}?topic=invite:rejected:${inviteeAccount}`)
        }
      }
    })

    return () => {
      inviteAcceptedSub.unsubscribe()
      inviteRejectedSub.unsubscribe()
      sub.unsubscribe()
    }
  }, [chatClientProxy, refreshMessages, topic, nav, peer])

  useEffect(() => {
    refreshMessages()
  }, [refreshMessages, chatClientProxy])

  if (!(threads.map(thread => thread.topic).includes(topic) || topic.includes('invite'))) {
    nav('/')
  }

  return (
    <div className="ThreadWindow">
      <div className="ThreadWindow__header">
        <div className="ThreadWindow__peer">
          <BackButton backTo="/messages" />
          <Avatar address={peerAddress} width="1.25em" height="1.25em" />
          <span>{ensName ?? truncate(peer ?? '', 10)}</span>
        </div>
        <ThreadDropdown dropdownPlacement="bottomLeft" h="1em" w="2em" threadId={topic} />
      </div>
      <div className="ThreadWindow__messages">
        <ConversationBeginning peerAddress={peerAddress} ensName={ensName} />
        {isInvite && <InviteMessage peer={peerAddress} status={inviteStatus} />}
        <AnimatePresence initial={false}>
          {messages.map((message, i) => (
            <MessageItem
              key={message.timestamp}
              message={message}
              index={i}
              peer={peer}
              messages={messages}
              nextMessageAccount={messages[i + 1]?.authorAccount}
              previousMessageAccount={messages[i - 1]?.authorAccount}
            />
          ))}
        </AnimatePresence>
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
