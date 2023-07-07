import type { PushClientTypes } from '@walletconnect/push-client'
import { useCallback, useEffect, useState } from 'react'
import { noop } from 'rxjs'
import { subscribeModalService } from '../../../utils/store'
import type { W3iPushClient } from '../../../w3iProxy'
import type Web3InboxProxy from '../../../w3iProxy'
import { useAuthState } from './authHooks'
import { useUiState } from './uiHooks'

export const usePushState = (w3iProxy: Web3InboxProxy, proxyReady: boolean) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    PushClientTypes.PushSubscription[]
  >([])

  const { userPubkey } = useAuthState(w3iProxy, proxyReady)
  const { uiEnabled } = useUiState()

  const [registerMessage, setRegisterMessage] = useState<string | null>(null)

  const [pushClient, setPushClient] = useState<W3iPushClient | null>(null)

  useEffect(() => {
    if (proxyReady) {
      setPushClient(w3iProxy.push)
    }
  }, [w3iProxy, proxyReady])

  const refreshPushState = useCallback(() => {
    if (!pushClient || !userPubkey) {
      return
    }

    pushClient.getActiveSubscriptions().then(subscriptions => {
      setActiveSubscriptions(Object.values(subscriptions))
    })
  }, [pushClient, userPubkey])

  useEffect(() => {
    refreshPushState()
  }, [refreshPushState])

  const handleRegistration = useCallback(
    async (key: string) => {
      if (pushClient && key && uiEnabled.push) {
        try {
          await pushClient.enableSync({ account: `eip155:1:${key}` })
          setRegisterMessage(null)
          refreshPushState()
        } catch (error) {
          setRegisterMessage(null)
        }
      }
    },
    [uiEnabled, pushClient, refreshPushState, setRegisterMessage]
  )

  useEffect(() => {
    if (userPubkey) {
      handleRegistration(userPubkey)
    } else {
      setRegisterMessage(null)
    }
  }, [handleRegistration, setRegisterMessage, userPubkey])

  useEffect(() => {
    if (!pushClient) {
      return noop
    }

    const pushRequestSub = pushClient.observe('push_request', {
      next: pushRequest => {
        subscribeModalService.toggleModal(pushRequest)
        refreshPushState()
      }
    })
    const pushSignatureRequestedSub = pushClient.observe('push_signature_requested', {
      next: ({ message }) => setRegisterMessage(message)
    })

    const pushSignatureRequestCancelledSub = pushClient.observe(
      'push_signature_request_cancelled',
      {
        next: () => setRegisterMessage(null)
      }
    )

    const pushSubscriptionSub = pushClient.observe('push_subscription', {
      next: refreshPushState
    })
    const pushDeleteSub = pushClient.observe('push_delete', {
      next: refreshPushState
    })
    const pushUpdateSub = pushClient.observe('push_update', {
      next: refreshPushState
    })

    return () => {
      pushRequestSub.unsubscribe()
      pushSubscriptionSub.unsubscribe()
      pushUpdateSub.unsubscribe()
      pushDeleteSub.unsubscribe()
      pushSignatureRequestedSub.unsubscribe()
      pushSignatureRequestCancelledSub.unsubscribe()
    }
  }, [pushClient, refreshPushState])

  return { activeSubscriptions, registerMessage, pushClient, refreshPushState }
}
