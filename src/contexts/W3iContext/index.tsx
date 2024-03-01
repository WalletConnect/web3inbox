import React, { useEffect } from 'react'

import { useAllSubscriptions, useWeb3InboxAccount, useWeb3InboxClient } from '@web3inbox/react'

import W3iContext from '@/contexts/W3iContext/context'
import { useAuthState } from '@/contexts/W3iContext/hooks/authHooks'
import { useW3iProxy } from '@/contexts/W3iContext/hooks/w3iProxyHooks'
import { registerWithEcho } from '@/utils/notifications'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const [w3iProxy, isW3iProxyReady] = useW3iProxy()

  const { userPubkey, setUserPubkey } = useAuthState(w3iProxy, isW3iProxyReady)

  const { data: client } = useWeb3InboxClient()
  const { data: activeSubscriptions } = useAllSubscriptions()
  const { identityKey: notifyRegisteredKey } = useWeb3InboxAccount(userPubkey)

  useEffect(() => {
    if(client) {
      registerWithEcho(client)
    }
  }, [client])

  return (
    <W3iContext.Provider
      value={{
        userPubkey,
        activeSubscriptions: activeSubscriptions ?? [],
        notifyRegisteredKey,
        setUserPubkey,
        watchSubscriptionsComplete: Boolean(client)
      }}
    >
      {children}
    </W3iContext.Provider>
  )
}

export default W3iContextProvider
