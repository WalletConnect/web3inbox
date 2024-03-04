'use client'

import { useState } from 'react'

import Web3InboxProxy from '../../../w3iProxy'

export const useW3iProxy = () => {
  const [w3iProxy] = useState(Web3InboxProxy.getProxy())
  const [ready] = useState(true)

  return [w3iProxy, ready] as [Web3InboxProxy, boolean]
}
