import { useState } from 'react'
import type Web3InboxProxy from '../../../w3iProxy'

export const useProviderQueries = () => {
  const query = new URLSearchParams(window.location.search)
  const pushProviderQuery = query.get('notifyProvider')
  const authProviderQuery = query.get('authProvider')

  const [authProvider] = useState(
    authProviderQuery ? (authProviderQuery as Web3InboxProxy['authProvider']) : 'internal'
  )

  // PUSH STATE
  const [pushProvider] = useState(
    pushProviderQuery ? (pushProviderQuery as Web3InboxProxy['pushProvider']) : 'internal'
  )

  return { authProvider, pushProvider }
}
