import type { PushClientTypes } from '@walletconnect/push-client'
import { useCallback, useEffect, useState } from 'react'
import { noop } from 'rxjs'
import { subscribeModalService } from '../../../utils/store'
import type { W3iPushClient } from '../../../w3iProxy'
import type Web3InboxProxy from '../../../w3iProxy'
import { useAuthState } from './authHooks'

export const usePushState = (w3iProxy: Web3InboxProxy) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    PushClientTypes.PushSubscription[]
  >([])

  const { userPubkey } = useAuthState(w3iProxy)
  const [pushClient, setPushClient] = useState<W3iPushClient | null>(null)

  useEffect(() => {
    w3iProxy.init().then(() => {
      setPushClient(w3iProxy.push)
    })
  }, [w3iProxy])

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
    }
  }, [pushClient, refreshPushState])

  return { activeSubscriptions, pushClient, refreshPushState }
}
