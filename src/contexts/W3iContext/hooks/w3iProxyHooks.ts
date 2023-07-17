'use client'

import { useEffect, useState } from 'react'
import Web3InboxProxy from '../../../w3iProxy'
import { useDappContext } from './dappContext'
import { useProviderQueries } from './providerQueryHooks'
import { useUiState } from './uiHooks'

export const useW3iProxy = () => {
  const relayUrl = import.meta.env.VITE_RELAY_URL
  const projectId = import.meta.env.VITE_PROJECT_ID

  const { uiEnabled } = useUiState()
  const [ready, setReady] = useState(false)
  const { dappContext } = useDappContext()
  const { chatProvider, pushProvider, authProvider } = useProviderQueries()

  const [w3iProxy] = useState(
    Web3InboxProxy.getProxy(
      chatProvider,
      pushProvider,
      authProvider,
      dappContext ? 'external' : 'internal',
      dappContext,
      projectId,
      relayUrl,
      uiEnabled
    )
  )

  useEffect(() => {
    w3iProxy.init().then(() => setReady(true))
  }, [w3iProxy, setReady])

  return [w3iProxy, ready] as [Web3InboxProxy, boolean]
}
