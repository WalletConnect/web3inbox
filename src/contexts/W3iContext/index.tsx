import React, { useEffect } from 'react'

import { useAllSubscriptions, useWeb3InboxAccount, useWeb3InboxClient } from '@web3inbox/react'

import W3iContext from '@/contexts/W3iContext/context'
import { useAuthState } from '@/contexts/W3iContext/hooks/authHooks'
import { registerWithEcho } from '@/utils/notifications'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {

  const { userPubkey, setUserPubkey } = useAuthState()

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
