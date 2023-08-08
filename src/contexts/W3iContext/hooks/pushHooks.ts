import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { noop } from 'rxjs'
import type { W3iPushClient } from '../../../w3iProxy'
import type Web3InboxProxy from '../../../w3iProxy'
import { JsCommunicator } from '../../../w3iProxy/externalCommunicators/jsCommunicator'
import { useAuthState } from './authHooks'
import { useUiState } from './uiHooks'
import { EventEmitter } from 'events'

export const usePushState = (w3iProxy: Web3InboxProxy, proxyReady: boolean, dappOrigin: string) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    NotifyClientTypes.NotifySubscription[]
  >([])

  const { pathname } = useLocation()
  const [emitter] = useState(new EventEmitter())

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
    [uiEnabled, pathname, pushClient, refreshPushState, setRegisterMessage]
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

    const pushSignatureRequestedSub = pushClient.observe('notify_signature_requested', {
      next: ({ message }) => setRegisterMessage(message)
    })

    const pushSignatureRequestCancelledSub = pushClient.observe(
      'notify_signature_request_cancelled',
      {
        next: () => setRegisterMessage(null)
      }
    )

    const pushSubscriptionSub = pushClient.observe('notify_subscription', {
      next: refreshPushState
    })
    const pushDeleteSub = pushClient.observe('notify_delete', {
      next: refreshPushState
    })
    const pushUpdateSub = pushClient.observe('notify_update', {
      next: refreshPushState
    })

    const syncUpdateSub = pushClient.observe('sync_update', {
      next: refreshPushState
    })

    return () => {
      // PushRequestSub.unsubscribe()
      pushSubscriptionSub.unsubscribe()
      syncUpdateSub.unsubscribe()
      pushUpdateSub.unsubscribe()
      pushDeleteSub.unsubscribe()
      pushSignatureRequestedSub.unsubscribe()
      pushSignatureRequestCancelledSub.unsubscribe()
    }
  }, [pushClient, refreshPushState])

  // Events used exclusively when in an iframe/widget-mode
  useEffect(() => {
    if (!pushClient || !dappOrigin) {
      return noop
    }

    const pushMessageSub = pushClient.observe('notify_message', {
      next: message => {
        /*
         * Due to the fact that data is synced, push_message events can be triggered
         * from subscriptions unrelated to the one related to the dappOrigin
         */
        if (message.params.message.url !== dappOrigin) {
          return
        }

        const communicator = new JsCommunicator(emitter)
        communicator.postToExternalProvider(
          'dapp_push_notification',
          {
            notification: message.params.message
          },
          'notify'
        )
      }
    })

    const pushSubscriptionSub = pushClient.observe('notify_subscription', {
      next: message => {
        /*
         * Due to the fact that data is synced, notify_subscription events can be triggered
         * from dapps unrelated to the one owning the dappOrigin
         */
        if (message.params.subscription?.metadata.url !== dappOrigin) {
          return
        }

        const communicator = new JsCommunicator(emitter)
        communicator.postToExternalProvider('dapp_subscription_settled', {}, 'notify')
      }
    })

    return () => {
      pushMessageSub.unsubscribe()
      pushSubscriptionSub.unsubscribe()
    }
  }, [dappOrigin, pushClient, emitter])

  return { activeSubscriptions, registerMessage, pushClient, refreshPushState }
}
