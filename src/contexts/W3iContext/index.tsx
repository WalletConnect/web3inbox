import React, { useCallback, useEffect, useState } from 'react'
import type { W3iChatClient, W3iPushClient } from '../../w3iProxy'
// eslint-disable-next-line no-duplicate-imports
import Web3InboxProxy from '../../w3iProxy'
import W3iContext from './context'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import { noop } from 'rxjs'
import type { PushClientTypes } from '@walletconnect/push-client'
import { useLocation } from 'react-router-dom'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const relayUrl = import.meta.env.VITE_RELAY_URL
  const projectId = import.meta.env.VITE_PROJECT_ID
  const query = new URLSearchParams(window.location.search)
  const chatProviderQuery = query.get('chatProvider')
  const pushProviderQuery = query.get('pushProvider')

  // CHAT STATE
  const [chatProvider] = useState(
    chatProviderQuery ? (chatProviderQuery as Web3InboxProxy['chatProvider']) : 'internal'
  )
  const [chatClient, setChatClient] = useState<W3iChatClient | null>(null)
  const [registeredKey, setRegistered] = useState<string | null>(null)
  const [invites, setInvites] = useState<ChatClientTypes.ReceivedInvite[]>([])
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([])
  const [sentInvites, setSentInvites] = useState<ChatClientTypes.SentInvite[]>([])
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    PushClientTypes.PushSubscription[]
  >([])

  const [userPubkey, setUserPubkey] = useState<string | undefined>(undefined)
  const { search } = useLocation()

  // PUSH STATE
  const [pushClient, setPushClient] = useState<W3iPushClient | null>(null)
  const [pushProvider] = useState(
    pushProviderQuery ? (pushProviderQuery as Web3InboxProxy['pushProvider']) : 'internal'
  )

  useEffect(() => {
    const account = new URLSearchParams(search).get('account')

    if (account) {
      setUserPubkey(account)
      setRegistered(null)
    }
  }, [search, setUserPubkey])

  useEffect(() => {
    const sub = chatClient?.observe('chat_account_change', {
      next: ({ account }) => {
        setUserPubkey(account)
        setRegistered(null)
      }
    })

    return () => sub?.unsubscribe()
  }, [chatClient])
  useEffect(() => {
    if (chatClient && pushClient) {
      return
    }

    const w3iProxy = new Web3InboxProxy(chatProvider, pushProvider, projectId, relayUrl)
    w3iProxy
      .init()
      .then(() => setChatClient(w3iProxy.chat))
      .then(() => {
        const account = w3iProxy.chat.getAccount()
        if (account) {
          setUserPubkey(account)
        }
      })
      .then(() => setPushClient(w3iProxy.push))
  }, [setChatClient, chatClient, setUserPubkey, setPushClient, pushClient])

  const refreshPushState = useCallback(() => {
    if (!pushClient || !userPubkey) {
      return
    }

    pushClient.getActiveSubscriptions().then(subscriptions => {
      console.log({ subscriptions })
      setActiveSubscriptions(Object.values(subscriptions))
    })
  }, [pushClient, userPubkey])

  const refreshChatState = useCallback(() => {
    if (!chatClient || !userPubkey || !registeredKey) {
      return
    }

    chatClient
      .getReceivedInvites({ account: `eip155:1:${userPubkey}` })
      .then(invite => setInvites(Array.from(invite.values())))
    chatClient
      .getSentInvites({ account: `eip155:1:${userPubkey}` })
      .then(invite => setSentInvites(Array.from(invite.values())))
    chatClient
      .getThreads({ account: `eip155:1:${userPubkey}` })
      .then(invite => setThreads(Array.from(invite.values())))
  }, [chatClient, userPubkey, setThreads, registeredKey, setInvites])

  useEffect(() => {
    if (!chatClient) {
      return noop
    }

    const inviteSub = chatClient.observe('chat_invite', {
      next: () => {
        refreshChatState()
      }
    })

    const signatureSub = chatClient.observe('chat_signature_requested', {
      next: ({ message }) => {
        setRegisterMessage(message)
      }
    })

    const inviteSentSub = chatClient.observe('chat_invite_sent', { next: refreshChatState })
    const pingSub = chatClient.observe('chat_ping', {
      next: () => {
        console.log('Got a ping!')
        refreshChatState()
      }
    })
    const chatMessageSentSub = chatClient.observe('chat_message_sent', { next: refreshChatState })
    const chatJoinedSub = chatClient.observe('chat_joined', { next: refreshChatState })
    const inviteAcceptedSub = chatClient.observe('chat_invite_accepted', { next: refreshChatState })
    const inviteRejectedSub = chatClient.observe('chat_invite_rejected', { next: refreshChatState })

    return () => {
      inviteSub.unsubscribe()
      pingSub.unsubscribe()
      signatureSub.unsubscribe()
      inviteSentSub.unsubscribe()
      inviteAcceptedSub.unsubscribe()
      inviteRejectedSub.unsubscribe()
      chatMessageSentSub.unsubscribe()
      chatJoinedSub.unsubscribe()
    }
  }, [chatClient, refreshChatState])

  useEffect(() => {
    const handleRegistration = async () => {
      if (chatClient && userPubkey) {
        try {
          const registeredKeyRes = await chatClient.register({ account: `eip155:1:${userPubkey}` })
          console.log('registed with', `eip155:1:${userPubkey}`, 'pub key: ', registeredKeyRes)
          refreshChatState()
          setRegistered(registeredKeyRes)
        } catch (error) {
          setRegisterMessage(null)
        }
      }
    }
    handleRegistration()
  }, [chatClient, userPubkey])

  useEffect(() => {
    refreshChatState()
  }, [refreshChatState])
  useEffect(() => {
    refreshPushState()
  }, [refreshPushState])

  return (
    <W3iContext.Provider
      value={{
        chatClientProxy: chatClient,
        chatProvider,
        pushProvider,
        userPubkey,
        refreshThreadsAndInvites: refreshChatState,
        sentInvites,
        threads,
        activeSubscriptions,
        invites,
        registeredKey,
        setUserPubkey,
        registerMessage,
        pushClientProxy: pushClient
      }}
    >
      {children}
    </W3iContext.Provider>
  )
}

export default W3iContextProvider
