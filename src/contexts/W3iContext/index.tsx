import React from 'react'
import W3iContext from './context'
import { useUiState } from './hooks/uiHooks'
import { useProviderQueries } from './hooks/providerQueryHooks'
import { useAuthState } from './hooks/authHooks'
import { usePushState } from './hooks/pushHooks'
import { useW3iProxy } from './hooks/w3iProxyHooks'
import { useDappOrigin } from './hooks/dappOrigin'
import { noop } from 'rxjs'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const { uiEnabled } = useUiState()
  const { dappOrigin, dappIcon, dappName, dappNotificationDescription } = useDappOrigin()
  const { pushProvider, authProvider } = useProviderQueries()
  const [w3iProxy, isW3iProxyReady] = useW3iProxy()

  const { userPubkey, setUserPubkey } = useAuthState(w3iProxy, isW3iProxyReady)

  const {
    pushClient,
    activeSubscriptions,
    refreshPushState,
    registerMessage: pushRegisterMessage,
    registeredKey: pushRegisteredKey
  } = usePushState(w3iProxy, isW3iProxyReady, dappOrigin)

  return (
    <W3iContext.Provider
      value={{
        chatClientProxy: null,
        pushProvider,
        authProvider,
        userPubkey,
        uiEnabled,
        dappOrigin,
        dappName,
        dappNotificationDescription,
        dappIcon,
        refreshNotifications: refreshPushState,
        refreshThreadsAndInvites: noop,
        activeSubscriptions,
        pushRegisteredKey,
        setUserPubkey,
        pushRegisterMessage,
        pushClientProxy: pushClient,
        sentInvites: [],
        threads: [],
        invites: []
      }}
    >
      {children}
    </W3iContext.Provider>
  )
}

export default W3iContextProvider
