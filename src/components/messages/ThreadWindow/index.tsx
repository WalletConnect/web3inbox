import type { ChatClientTypes } from '@walletconnect/chat-client'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
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
  const { chatClientProxy, userPubkey, threads, sentInvites } = useContext(W3iContext)
  const { data: ensName } = useEnsName({ address: peerAddress })
  const topic = useMemo(
    () =>
      new URLSearchParams(search).get('topic') ??
      threads.find(thread => thread.peerAccount === peer)?.topic ??
      '',
    [threads, search]
  )

  if (!topic) {
    return <Navigate to="/messages" />
  }

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

  const refreshMessages = useCallback(() => {
    console.log(
      `Calling refreshMessages with topic ${topic} and a ${
        chatClientProxy ? 'truthy' : 'falsy'
      } client`
    )

    if (!chatClientProxy || !topic) {
      return
    }

    console.log(`Retreiving messages for topic ${topic}`)

    chatClientProxy
      .getMessages({
        topic
      })
      .then(allChatMessages => {
        console.log(`Retreived messages: ${allChatMessages.map(m => m.timestamp).join(',')} `)
        setMessages(allChatMessages)
      })
      .catch(() => {
        console.error('getMessages failed, redirecting to root')
        nav('/')
      })

    if (!topic.includes('invite') && userPubkey) {
      // Not using `threads` to avoid a data race.
      chatClientProxy.getThreads({ account: `eip155:1:${userPubkey}` }).then(retreivedThreads => {
        if (!retreivedThreads.get(topic)) {
          console.error('topic not in threads, redirecting to root')
          nav('/')
        }
      })
    }
  }, [chatClientProxy, search, setMessages, topic])

  useEffect(() => {
    if (!chatClientProxy) {
      return noop
    }
    const receivedMessageSub = chatClientProxy.observe('chat_message', {
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

    const sentMessageSub = chatClientProxy.observe('chat_message_sent', {
      next: refreshMessages
    })

    const inviteAcceptedSub = chatClientProxy.observe('chat_invite_accepted', {
      next: inviteAcceptedEvent => {
        console.log(
          `Accepted invite event, isInvite: ${
            isInvite ? 'YES' : 'NO'
          }, invite TEST2: ${JSON.stringify(inviteAcceptedEvent)}`
        )
        const { inviteeAccount } = inviteAcceptedEvent.invite
        if (isInvite && inviteeAccount === peer) {
          nav(`/messages/chat/${inviteeAccount}?topic=${inviteAcceptedEvent.topic}`)
        }
      }
    })

    const inviteRejectedSub = chatClientProxy.observe('chat_invite_rejected', {
      next: inviteRejectedEvent => {
        if (isInvite && inviteRejectedEvent.invite.inviteeAccount === peer) {
          const { inviteeAccount } = inviteRejectedEvent.invite
          nav(`/messages/chat/${inviteeAccount}?topic=invite:rejected:${inviteeAccount}`)
        }
      }
    })

    return () => {
      inviteAcceptedSub.unsubscribe()
      inviteRejectedSub.unsubscribe()
      receivedMessageSub.unsubscribe()
      sentMessageSub.unsubscribe()
    }
  }, [chatClientProxy, refreshMessages, topic, nav, peer])

  useEffect(() => {
    console.log('Refresh messages useEffect')
    refreshMessages()
  }, [refreshMessages])

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
      <MessageBox authorAccount={`eip155:1:${userPubkey ?? ''}`} topic={topic} />
    </div>
  )
}

export default ThreadWindow
