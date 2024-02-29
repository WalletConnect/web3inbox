'use client'

import { useEffect, useState } from 'react'

import { logError } from '@/utils/error'

import Web3InboxProxy from '../../../w3iProxy'

export const useW3iProxy = () => {
  const [ready, setReady] = useState(false)

  const [w3iProxy] = useState(
    Web3InboxProxy.getProxy()
  )

  useEffect(() => {
    if (w3iProxy.isInitializing) {
      return
    }
      w3iProxy
        .init()
        .then(() => {
          setReady(true)
        })
        .catch(error => {
          logError(error)
        })
  }, [w3iProxy.isInitializing])

  return [w3iProxy, ready] as [Web3InboxProxy, boolean]
}
