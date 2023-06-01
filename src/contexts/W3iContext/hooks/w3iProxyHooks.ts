import { useEffect, useState } from 'react'
import Web3InboxProxy from '../../../w3iProxy'
import { useProviderQueries } from './providerQueryHooks'
import { useUiState } from './uiHooks'

export const useW3iProxy = () => {
  const relayUrl = import.meta.env.VITE_RELAY_URL
  const projectId = import.meta.env.VITE_PROJECT_ID

  const { uiEnabled } = useUiState()
  const { chatProvider, pushProvider, authProvider } = useProviderQueries()

  const [w3iProxy] = useState(
    Web3InboxProxy.getProxy(
      chatProvider,
      pushProvider,
      authProvider,
      projectId,
      relayUrl,
      uiEnabled
    )
  )

  useEffect(() => {
    w3iProxy.init()
  }, [w3iProxy])

  return w3iProxy
}
