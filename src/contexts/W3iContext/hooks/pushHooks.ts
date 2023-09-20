import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { EventEmitter } from 'events'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { noop } from 'rxjs'
import type Web3InboxProxy from '../../../w3iProxy'
import type { W3iPushClient } from '../../../w3iProxy'
import { JsCommunicator } from '../../../w3iProxy/externalCommunicators/jsCommunicator'
import { useAuthState } from './authHooks'
import { useUiState } from './uiHooks'

export const usePushState = (w3iProxy: Web3InboxProxy, proxyReady: boolean, dappOrigin: string) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    NotifyClientTypes.NotifySubscription[]
  >([])

  const { pathname } = useLocation()
  const [emitter] = useState(new EventEmitter())

  const { userPubkey } = useAuthState(w3iProxy, proxyReady)
  const { uiEnabled } = useUiState()

  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const [registeredKey, setRegistered] = useState<string | null>(null)

  const [pushClient, setPushClient] = useState<W3iPushClient | null>(null)

  useEffect(() => {
    if (proxyReady) {
      setPushClient(w3iProxy.notify)
    }
  }, [w3iProxy, proxyReady])

  const refreshPushState = useCallback(() => {
    if (!proxyReady || !pushClient || !userPubkey) {
      return
    }
    pushClient.getActiveSubscriptions({ account: `eip155:1:${userPubkey}` }).then(subscriptions => {
      setActiveSubscriptions(Object.values(subscriptions))
    })
  }, [pushClient, userPubkey, proxyReady])

  useEffect(() => {
    // Account for sync init
    const timeoutId = setTimeout(() => refreshPushState(), 100)

    return () => clearTimeout(timeoutId)
  }, [refreshPushState])

  const handleRegistration = useCallback(
    async (key: string) => {
      if (pushClient && key && uiEnabled.notify) {
        try {
          const identityKey = await pushClient.register({
            account: `eip155:1:${key}`,
            domain: window.location.hostname,
            isLimited: false
          })

          setRegisterMessage(null)
          setRegistered(identityKey)
          refreshPushState()
        } catch (error) {
          setRegisterMessage(null)
        }
      }
    },
    [uiEnabled, pushClient, refreshPushState, setRegisterMessage]
  )

  useEffect(() => {
    /*
     * No need to register if chat is enabled since it will handle registration
     * notify.register is disabled in favor of chat.register since
     * chat.register performs an extra step.
     */
    if (userPubkey && !uiEnabled.chat) {
      handleRegistration(userPubkey)
    } else {
      setRegisterMessage(null)
    }
  }, [handleRegistration, setRegisterMessage, userPubkey])

  useEffect(() => {
    if (!userPubkey) {
      setRegistered(null)
    }
  }, [userPubkey, setRegistered])

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

    const pushSubsChanged = pushClient.observe('notify_subscriptions_changed', {
      next: refreshPushState
    })

    const syncUpdateSub = pushClient.observe('sync_update', {
      next: refreshPushState
    })

    return () => {
      pushSubscriptionSub.unsubscribe()
      syncUpdateSub.unsubscribe()
      pushUpdateSub.unsubscribe()
      pushDeleteSub.unsubscribe()
      pushSubsChanged.unsubscribe()
      pushSignatureRequestedSub.unsubscribe()
      pushSignatureRequestCancelledSub.unsubscribe()
    }
  }, [pushClient, refreshPushState])

  const checkAndInformIfWidgetSubbed = useCallback(() => {
    if (!pushClient) {
      return
    }

    pushClient.getActiveSubscriptions({ account: `eip155:1:${userPubkey ?? ''}` }).then(subs => {
      const dappSubExists = Object.values(subs)
        .map(sub => sub.metadata.appDomain)
        .some(url => url === dappOrigin)
      if (dappSubExists) {
        const communicator = new JsCommunicator(emitter)
        communicator.postToExternalProvider('dapp_subscription_settled', {}, 'notify')
      }
    })
  }, [userPubkey, pushClient, dappOrigin, emitter])

  return { activeSubscriptions, registeredKey, registerMessage, pushClient, refreshPushState }
}
