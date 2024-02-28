import React from 'react'

import { noop } from 'rxjs'

import W3iContext from '@/contexts/W3iContext/context'
import { useAuthState } from '@/contexts/W3iContext/hooks/authHooks'
import { useDappOrigin } from '@/contexts/W3iContext/hooks/dappOrigin'
import { useNotifyState } from '@/contexts/W3iContext/hooks/notifyHooks'
import { useProviderQueries } from '@/contexts/W3iContext/hooks/providerQueryHooks'
import { useW3iProxy } from '@/contexts/W3iContext/hooks/w3iProxyHooks'
import { useAllSubscriptions } from '@web3inbox/react'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const { dappOrigin, dappIcon, dappName, dappNotificationDescription } = useDappOrigin()
  const { notifyProvider, authProvider } = useProviderQueries()
  const [w3iProxy, isW3iProxyReady] = useW3iProxy()

  const { userPubkey, setUserPubkey } = useAuthState(w3iProxy, isW3iProxyReady)

  const {
    notifyClient,
    refreshNotifyState,
    registerMessage: notifyRegisterMessage,
    registeredKey: notifyRegisteredKey,
    watchSubscriptionsComplete
  } = useNotifyState(w3iProxy, isW3iProxyReady)

  const {data: activeSubscriptions} = useAllSubscriptions();

  return (
    <W3iContext.Provider
      value={{
        chatClientProxy: null,
        notifyProvider,
        authProvider,
        userPubkey,
        dappOrigin,
        dappName,
        dappNotificationDescription,
        dappIcon,
        refreshNotifications: refreshNotifyState,
        refreshThreadsAndInvites: noop,
        activeSubscriptions: activeSubscriptions ?? [],
        notifyRegisteredKey,
        setUserPubkey,
        notifyRegisterMessage,
        notifyClientProxy: notifyClient,
        sentInvites: [],
        threads: [],
        invites: [],
        watchSubscriptionsComplete
      }}
    >
      {children}
    </W3iContext.Provider>
  )
}

export default W3iContextProvider
