import React from 'react'

import { noop } from 'rxjs'

import W3iContext from './context'
import { useAuthState } from './hooks/authHooks'
import { useDappOrigin } from './hooks/dappOrigin'
import { useNotifyState } from './hooks/notifyHooks'
import { useProviderQueries } from './hooks/providerQueryHooks'
import { useUiState } from './hooks/uiHooks'
import { useW3iProxy } from './hooks/w3iProxyHooks'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const { uiEnabled } = useUiState()
  const { dappOrigin, dappIcon, dappName, dappNotificationDescription } = useDappOrigin()
  const { notifyProvider, authProvider } = useProviderQueries()
  const [w3iProxy, isW3iProxyReady] = useW3iProxy()

  const { userPubkey, setUserPubkey } = useAuthState(w3iProxy, isW3iProxyReady)

  const {
    notifyClient,
    activeSubscriptions,
    refreshNotifyState,
    registerMessage: notifyRegisterMessage,
    registeredKey: notifyRegisteredKey
  } = useNotifyState(w3iProxy, isW3iProxyReady)

  return (
    <W3iContext.Provider
      value={{
        chatClientProxy: null,
        notifyProvider,
        authProvider,
        userPubkey,
        uiEnabled: { ...uiEnabled, chat: false },
        dappOrigin,
        dappName,
        dappNotificationDescription,
        dappIcon,
        refreshNotifications: refreshNotifyState,
        refreshThreadsAndInvites: noop,
        activeSubscriptions,
        notifyRegisteredKey,
        setUserPubkey,
        notifyRegisterMessage,
        notifyClientProxy: notifyClient,
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
