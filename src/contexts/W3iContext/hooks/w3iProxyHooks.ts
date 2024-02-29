'use client'

import { useEffect, useState } from 'react'

import { logError } from '@/utils/error'

import Web3InboxProxy from '../../../w3iProxy'
import { useDappOrigin } from './dappOrigin'

export const useW3iProxy = () => {
  const relayUrl = import.meta.env.VITE_RELAY_URL
  const projectId = import.meta.env.VITE_PROJECT_ID

  const [ready, setReady] = useState(false)
  const { dappOrigin } = useDappOrigin()

  const [w3iProxy] = useState(
    Web3InboxProxy.getProxy('internal', 'internal', dappOrigin, projectId, relayUrl, {
      chat: true,
      notify: true,
      settings: true,
      sidebar: true
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
          logError(error)
        })
    }
  }, [w3iProxy.isInitializing])

  return [w3iProxy, ready] as [Web3InboxProxy, boolean]
}
