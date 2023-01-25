import React, { useCallback, useEffect, useState } from 'react'
import Web3InboxProxy from '../../w3iProxy'
import type { W3iChatClient } from '../../w3iProxy'
import W3iContext from './context'
import { formatEthChainsAddress } from '../../utils/address'
import type { ChatClientTypes } from '@walletconnect/chat-client'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const relayUrl = import.meta.env.VITE_RELAY_URL
  const projectId = import.meta.env.VITE_PROJECT_ID
  const chatProviderQuery = new URLSearchParams(window.location.search).get('chatProvider')
  const [chatProvider] = useState(
    chatProviderQuery ? (chatProviderQuery as Web3InboxProxy['chatProvider']) : 'internal'
  )

  const [chatClient, setChatClient] = useState<W3iChatClient | null>(null)
  const [registeredKey, setRegistered] = useState<string | null>(null)
  const [invites, setInvites] = useState<ChatClientTypes.Invite[]>([])
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([])
  const [pendingThreads, setPendingThreads] = useState<ChatClientTypes.Thread[]>([])

  const [userPubkey, setUserPubkey] = useState<string | undefined>(undefined)

  useEffect(() => {
    chatClient?.observe('chat_account_change', {
      next: ({ account }) => {
        setUserPubkey(account)
      }
    })
  }, [chatClient])

  useEffect(() => {
    if (chatClient && userPubkey) {
      chatClient.register({ account: `eip155:1:${userPubkey}` }).then(registeredKeyRes => {
        console.log('registed with', `eip155:1:${userPubkey}`, 'pub key: ', registeredKeyRes)
        setRegistered(registeredKeyRes)
      })
    }
  }, [chatClient, userPubkey])

  useEffect(() => {
    if (chatClient) {
      return
    }

    const w3iProxy = new Web3InboxProxy(chatProvider, projectId, relayUrl)
    w3iProxy
      .init()
      .then(() => setChatClient(w3iProxy.chat))
      .then(() => {
        setUserPubkey(w3iProxy.chat.getAccount())
      })
  }, [setChatClient, chatClient])

  const refreshThreads = useCallback(() => {
    console.log('Refreshing threads')
    if (!chatClient || !userPubkey) {
      return
    }

    chatClient
      .getInvites({ account: `eip155:1:${userPubkey}` })
      .then(invite => setInvites(Array.from(invite.values())))
    chatClient
      .getThreads({ account: `eip155:1:${userPubkey}` })
      .then(invite => setThreads(Array.from(invite.values())))
  }, [chatClient, userPubkey, setThreads, setInvites])

  useEffect(() => {
    if (!chatClient) {
      return
    }

    chatClient.observe('chat_invite', {
      next: inv => {
        console.log('got invite', inv)
        refreshThreads()
      }
    })
    chatClient.observe('chat_joined', { next: refreshThreads })
  }, [chatClient, refreshThreads])

  useEffect(() => {
    refreshThreads()
  }, [refreshThreads])

  return (
    <W3iContext.Provider
      value={{
        chatClientProxy: chatClient,
        userPubkey,
        refreshThreadsAndInvites: refreshThreads,
        threads,
        invites,
        registeredKey,
        setUserPubkey
      }}
    >
      {children}
    </W3iContext.Provider>
  )
}

export default W3iContextProvider
