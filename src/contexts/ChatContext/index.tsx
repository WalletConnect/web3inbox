import { ChatClient } from '@walletconnect/chat-client'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Web3InboxProxy from '../../w3iProxy'
import type { W3iChatClient } from '../../w3iProxy'
import ChatContext from './context'

interface ChatContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const relayUrl = import.meta.env.VITE_RELAY_URL
  const projectId = import.meta.env.VITE_PROJECT_ID
  const noClientModeQuery = new URLSearchParams(window.location.search).get('noClientMode')
  const noClientMode = noClientModeQuery ? (JSON.parse(noClientModeQuery) as boolean) : false

  const [chatClient, setChatClient] = useState<W3iChatClient | null>(null)
  const [registeredKey, setRegistered] = useState<string | null>(null)

  const { address } = useAccount()

  useEffect(() => {
    if (!(chatClient && address)) {
      return
    }
    chatClient.register({ account: `eip155:1:${address}` }).then(setRegistered)
  }, [address, chatClient])

  useEffect(() => {
    if (chatClient) {
      return
    }

    const w3iProxy = noClientMode ? new Web3InboxProxy() : new Web3InboxProxy(projectId, relayUrl)
    w3iProxy.init().then(() => setChatClient(w3iProxy.chat))
  }, [setChatClient, chatClient])

  return (
    <ChatContext.Provider value={{ chatClientProxy: chatClient, registeredKey }}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContextProvider
