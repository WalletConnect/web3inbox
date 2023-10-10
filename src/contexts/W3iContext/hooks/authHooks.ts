import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type Web3InboxProxy from '../../../w3iProxy'
import type W3iAuthFacade from '../../../w3iProxy/w3iAuthFacade'
import { formatEthChainsAddress } from '../../../utils/address'

export const useAuthState = (w3iProxy: Web3InboxProxy, proxyReady: boolean) => {
  const [accountQueryParam, setAccountQueryParam] = useState('')

  const [userPubkey, setUserPubkey] = useState<string | undefined>(undefined)
  const [authClient, setAuthClient] = useState<W3iAuthFacade | null>(null)

  useEffect(() => {
    if (proxyReady) {
      setAuthClient(w3iProxy.auth)
    }
  }, [w3iProxy, proxyReady])

  const { search } = useLocation()

  useEffect(() => {
    const account = new URLSearchParams(search).get('account')

    if (account) {
      setAccountQueryParam(account)
    }
  }, [search])

  useEffect(() => {
    if (accountQueryParam && authClient) {
      authClient.setAccount(accountQueryParam)
    }
  }, [accountQueryParam, authClient])

  useEffect(() => {
    const account = authClient?.getAccount()
    const chain = authClient?.getChain()
    if (account) {
      setUserPubkey(formatEthChainsAddress(account, chain))
    }
  }, [authClient, setUserPubkey])

  useEffect(() => {
    const sub = authClient?.observe('auth_set_account', {
      next: ({ account, chain }) => {
        setUserPubkey(formatEthChainsAddress(account, chain))
      }
    })

    return () => sub?.unsubscribe()
  }, [authClient, userPubkey, setUserPubkey])

  return { userPubkey, setUserPubkey }
}
