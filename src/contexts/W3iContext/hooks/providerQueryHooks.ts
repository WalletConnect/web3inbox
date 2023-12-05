import { useState } from 'react'

import type Web3InboxProxy from '@/w3iProxy'

export const useProviderQueries = () => {
  const query = new URLSearchParams(window.location.search)
  const notifyProviderQuery = query.get('notifyProvider')
  const authProviderQuery = query.get('authProvider')

  const [authProvider] = useState(
    authProviderQuery ? (authProviderQuery as Web3InboxProxy['authProvider']) : 'internal'
  )

  // NOTIFY STATE
  const [notifyProvider] = useState(
    notifyProviderQuery ? (notifyProviderQuery as Web3InboxProxy['notifyProvider']) : 'internal'
  )

  return { authProvider, notifyProvider }
}
