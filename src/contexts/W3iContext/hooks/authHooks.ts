import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type Web3InboxProxy from '../../../w3iProxy'
import type W3iAuthFacade from '../../../w3iProxy/w3iAuthFacade'
import { formatEthChainsAddress, getChain, getEthChainAddress } from '../../../utils/address'

export const useAuthState = (w3iProxy: Web3InboxProxy, proxyReady: boolean) => {
  const [accountQueryParam, setAccountQueryParam] = useState('')

  const [authClient, setAuthClient] = useState<W3iAuthFacade | null>(w3iProxy.auth)

  const account = authClient?.getAccount()
  const chain = authClient?.getChain()

  const [userPubkey, setUserPubkey] = useState<string | undefined>(
    formatEthChainsAddress(account, chain)
  )

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
      authClient.updateFullAccount(
        getChain(accountQueryParam),
        getEthChainAddress(accountQueryParam)
      )
    }
  }, [accountQueryParam, authClient])

  useEffect(() => {
    const account = authClient?.getAccount()
    const chain = authClient?.getChain()
    if (account) {
      setUserPubkey(formatEthChainsAddress(account, chain))
    }
  }, [account, chain])

  useEffect(() => {
    const sub = authClient?.observe('auth_set_account', {
      next: ({ account, chain }) => {
        setUserPubkey(formatEthChainsAddress(account, chain))
      }
    })

    return () => sub?.unsubscribe()
  }, [authClient, userPubkey])

  return { userPubkey, setUserPubkey }
}
