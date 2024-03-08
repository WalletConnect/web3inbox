import React, { useEffect } from 'react'

import { useAllSubscriptions, useWeb3InboxAccount, useWeb3InboxClient } from '@web3inbox/react'

import W3iContext from '@/contexts/W3iContext/context'
import { useAuthState } from '@/contexts/W3iContext/hooks/authHooks'
import { registerWithEcho, setupSubscriptionsSymkeys } from '@/utils/notifications'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const { userPubkey, setUserPubkey } = useAuthState()

  const { data: client } = useWeb3InboxClient()
  const { identityKey: notifyRegisteredKey } = useWeb3InboxAccount(userPubkey)
  const { data: activeSubscriptions } = useAllSubscriptions()

  useEffect(() => {
    setupSubscriptionsSymkeys(activeSubscriptions?.map(sub => [sub.topic, sub.symKey]) ?? [])
  }, [activeSubscriptions])

  useEffect(() => {
    // register on client init
    // check for permissions granted to prevent asking for permissions
    // immediately after page load
    if(client && window?.Notification.permission === 'granted') {
      registerWithEcho(client)
    }
  }, [client])

  return (
    <W3iContext.Provider
      value={{
        userPubkey,
        notifyRegisteredKey,
        setUserPubkey,
        clientReady: Boolean(client)
      }}
    >
      {children}
    </W3iContext.Provider>
  )
}

export default W3iContextProvider
