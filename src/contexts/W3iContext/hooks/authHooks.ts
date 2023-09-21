import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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

  /*
   * UseEffect(() => {
   *   const hasSignSession = localStorage.getItem('wc@2:client:0.3//session')
   *   console.log({
   *     hasSignSession,
   *     userPubkey,
   *     proxyReady
   *   })
   */

  /*
   *   If (proxyReady && !userPubkey && hasSignSession) {
   *     console.log('>>>>> CLEANUP')
   */

  /*
   *     LocalStorage.removeItem('wc@2:client:0.3//session')
   *     window.location.reload()
   *   }
   * }, [userPubkey, proxyReady])
   */

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
        if (userPubkey && !account) {
          localStorage.removeItem('wc@2:client:0.3//session')
          window.location.reload()
        }
        setUserPubkey(account)
      }
    })

    return () => sub?.unsubscribe()
  }, [authClient, userPubkey, setUserPubkey])

  return { userPubkey, setUserPubkey }
}
