'use client'

import { useEffect, useState } from 'react'

import Web3InboxProxy from '../../../w3iProxy'
import { useDappOrigin } from './dappOrigin'
import { useProviderQueries } from './providerQueryHooks'
import { useUiState } from './uiHooks'

export const useW3iProxy = () => {
  const relayUrl = import.meta.env.VITE_RELAY_URL
  const projectId = import.meta.env.VITE_PROJECT_ID

  const { uiEnabled } = useUiState()
  const [ready, setReady] = useState(false)
  const { dappOrigin } = useDappOrigin()
  const { notifyProvider, authProvider } = useProviderQueries()

  const [w3iProxy] = useState(
    Web3InboxProxy.getProxy(notifyProvider, authProvider, dappOrigin, projectId, relayUrl, {
      ...uiEnabled,
      chat: false
    })
  )

  useEffect(() => {
    if (w3iProxy.isInitializing) {
      return
    }
    if (!w3iProxy.getInitComplete()) {
      w3iProxy
        .init()
        .then(() => {
          setReady(true)
        })
        .catch(error => {
          console.error('w3iProxy failed to initialize: ', error)
        })
    }
  }, [w3iProxy.isInitializing])

  return [w3iProxy, ready] as [Web3InboxProxy, boolean]
}
