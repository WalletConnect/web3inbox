import type { ChatClientTypes } from '../../../w3iProxy/chatProviders/types'
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
import type { ReplayMessage } from '../../../w3iProxy/w3iChatFacade'
import { getEthChainAddress } from '../../../utils/address'
import Text from '../../general/Text'

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

  const [pendingMessages, setPendingMessages] = useState<ReplayMessage[]>([])

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

    const unsentMessagesSub = chatClientProxy.observe('chat_message_attempt', {
      next: () => {
        setPendingMessages(chatClientProxy.getUnsentMessages())
      }
    })

    const inviteAcceptedSub = chatClientProxy.observe('chat_invite_accepted', {
      next: inviteAcceptedEvent => {
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
      unsentMessagesSub.unsubscribe()
    }
  }, [chatClientProxy, refreshMessages, topic, nav, peer])

  useEffect(() => {
    refreshMessages()
  }, [refreshMessages])

  return (
    <div className="ThreadWindow">
      <div className="ThreadWindow__border"></div>
      <div className="ThreadWindow__header">
        <div className="ThreadWindow__peer">
          <BackButton backTo="/messages" />
          <Avatar address={peerAddress} width="2.5rem" height="2.5rem" />
          <Text variant="paragraph-500">
            {peer ? truncate(getEthChainAddress(peer), 5) : ensName}
          </Text>
        </div>
        <ThreadDropdown dropdownPlacement="bottomLeft" h="2.5em" w="2.5em" threadId={topic} />
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
              status={message.authorAccount === peer ? undefined : 'sent'}
              peer={peer}
              messages={messages}
              nextMessageAccount={messages[i + 1]?.authorAccount}
              previousMessageAccount={messages[i - 1]?.authorAccount}
            />
          ))}
          {pendingMessages.map((message, i) => (
            <MessageItem
              key={message.timestamp}
              message={message}
              index={i}
              status={message.status}
              peer={peer}
              messages={pendingMessages}
              nextMessageAccount={pendingMessages[i + 1]?.authorAccount}
              previousMessageAccount={pendingMessages[i - 1]?.authorAccount}
            />
          ))}
        </AnimatePresence>
      </div>
      <MessageBox authorAccount={`eip155:1:${userPubkey ?? ''}`} topic={topic} />
    </div>
  )
}

export default ThreadWindow
