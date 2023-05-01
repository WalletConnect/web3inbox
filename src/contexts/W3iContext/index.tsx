import React, { useCallback, useEffect, useState } from 'react'
import type { W3iChatClient, W3iPushClient } from '../../w3iProxy'
// eslint-disable-next-line no-duplicate-imports
import Web3InboxProxy from '../../w3iProxy'
import W3iContext from './context'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import { noop } from 'rxjs'
import type { PushClientTypes } from '@walletconnect/push-client'
import { useLocation } from 'react-router-dom'
import { useDisconnect } from 'wagmi'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const { disconnect: wagmiDisconnect } = useDisconnect()
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

  const disconnect = useCallback(() => {
    setUserPubkey(undefined)
    setRegistered(null)
    wagmiDisconnect()
  }, [wagmiDisconnect])

  const pushEnabledQuery = query.get('pushEnabled')
  const chatEnabledQuery = query.get('chatEnabled')
  const settingsEnabledQuery = query.get('settingsEnabled')

  const [uiEnabled] = useState({
    push: pushEnabledQuery ? JSON.parse(pushEnabledQuery) : true,
    settings: settingsEnabledQuery ? JSON.parse(settingsEnabledQuery) : true,
    chat: chatEnabledQuery ? JSON.parse(chatEnabledQuery) : true,
    sidebar: false
  })

  const totalPagesEnabled = Object.values(uiEnabled).reduce<number>(
    (pagesAvailable, pageEnabled) => (pageEnabled ? pagesAvailable + 1 : pagesAvailable),
    0
  )

  if (totalPagesEnabled > 1) {
    uiEnabled.sidebar = true
  }

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

    const w3iProxy = new Web3InboxProxy(chatProvider, pushProvider, projectId, relayUrl, uiEnabled)
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

    console.log('refreshPushState')

    pushClient.getActiveSubscriptions().then(subscriptions => {
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
    if (!pushClient) {
      return noop
    }

    const pushRequestSub = pushClient.observe('push_request', { next: refreshPushState })

    return () => {
      pushRequestSub.unsubscribe()
    }
  }, [pushClient, refreshPushState])

  useEffect(() => {
    const handleRegistration = async () => {
      if (chatClient && userPubkey && uiEnabled.chat) {
        try {
          const registeredKeyRes = await chatClient.register({ account: `eip155:1:${userPubkey}` })
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
        uiEnabled,
        refreshThreadsAndInvites: refreshChatState,
        sentInvites,
        threads,
        activeSubscriptions,
        invites,
        disconnect,
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
