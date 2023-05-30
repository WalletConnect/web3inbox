import React from 'react'
import W3iContext from './context'
import { useUiState } from './hooks/uiHooks'
import { useProviderQueries } from './hooks/providerQueryHooks'
import { useAuthState } from './hooks/authHooks'
import { useChatState } from './hooks/chatHooks'
import { usePushState } from './hooks/pushHooks'
import { useW3iProxy } from './hooks/w3iProxyHooks'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const { uiEnabled } = useUiState()
  const { chatProvider, pushProvider } = useProviderQueries()
  const w3iProxy = useW3iProxy()

  const { userPubkey, setUserPubkey, disconnect } = useAuthState(w3iProxy)

  const {
    chatClient,
    sentInvites,
    refreshChatState,
    threads,
    invites,
    registeredKey,
    registerMessage
  } = useChatState(w3iProxy)

  const { pushClient, activeSubscriptions } = usePushState(w3iProxy)

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
