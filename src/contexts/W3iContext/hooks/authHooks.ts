import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDisconnect } from 'wagmi'
import type Web3InboxProxy from '../../../w3iProxy'
import type W3iAuthFacade from '../../../w3iProxy/w3iAuthFacade'

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

  const { disconnect: wagmiDisconnect } = useDisconnect()

  const disconnect = useCallback(() => {
    setUserPubkey(undefined)
    wagmiDisconnect()
  }, [wagmiDisconnect])

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
  }, [accountQueryParam, setUserPubkey, authClient])

  useEffect(() => {
    const account = authClient?.getAccount()
    if (account) {
      setUserPubkey(account)
    }
  }, [authClient, setUserPubkey])

  useEffect(() => {
    const sub = authClient?.observe('auth_set_account', {
      next: ({ account }) => {
        setUserPubkey(account)
      }
    })

    return () => sub?.unsubscribe()
  }, [authClient, setUserPubkey])

  return { userPubkey, setUserPubkey, disconnect }
}
