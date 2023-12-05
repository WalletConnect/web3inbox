import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient } from '@walletconnect/notify-client'
import type { EventEmitter } from 'events'
import mixpanel from 'mixpanel-browser'

import { getDbEchoRegistrations } from '@/utils/idb'
import {
  notificationsEnabledInBrowser,
  registerWithEcho,
  setupSubscriptionsSymkeys,
  userEnabledNotification
} from '@/utils/notifications'
import { W3iNotifyProvider } from '@/w3iProxy/notifyProviders/types'

export default class InternalNotifyProvider implements W3iNotifyProvider {
  private notifyClient: NotifyClient | undefined
  private readonly emitter: EventEmitter
  public providerName = 'InternalNotifyProvider'
  private readonly methodsListenedTo = ['notify_signature_delivered']

  public constructor(emitter: EventEmitter, _name = 'internal') {
    this.emitter = emitter
  }

  /*
   * We need to re-register events from the chat client to the emitter
   * to allow the observers in the facade to work seamlessly.
   */
  public initState(notifyClient: NotifyClient) {
    const updateSymkeyState = async () => {
      const subs = Object.values(await this.getActiveSubscriptions())

      if (this.notifyClient) {
        await setupSubscriptionsSymkeys(subs.map(({ topic, symKey }) => [topic, symKey]))
      }
    }
    this.notifyClient = notifyClient

    this.notifyClient.on('notify_subscription', args =>
      this.emitter.emit('notify_subscription', args)
    )
    this.notifyClient.on('notify_message', args => this.emitter.emit('notify_message', args))
    this.notifyClient.on('notify_subscriptions_changed', args => {
      updateSymkeyState()
      this.emitter.emit('notify_subscriptions_changed', args)
    })
    this.notifyClient.on('notify_update', args => this.emitter.emit('notify_update', args))
    this.notifyClient.on('notify_delete', args => this.emitter.emit('notify_delete', args))

    this.notifyClient.subscriptions.core.on('sync_store_update', () => {
      this.emitter.emit('sync_update', {})
    })

    // Ensure we have a registration with echo (if we need it)
    this.ensureEchoRegistration()
    updateSymkeyState()
  }

  // ------------------------ Provider-specific methods ------------------------

  /**
   * This method can be safely spammed because it is idempotent on 2 levels
   * 1. It checks if a registration is needed with `getRegisteredWithEcho`
   * 2. Even if this check didn't exist, and a message is posted to the service worker,
   * the service worker echo registration logic is also idempotent
   */
  private async ensureEchoRegistration() {
    // impossible case, just here to please typescript
    if (!this.notifyClient) {
      return
    }

    // No need to register with echo if user does not want notifications
    if (!userEnabledNotification()) {
      return
    }

    if (notificationsEnabledInBrowser()) {
      await window.Notification?.requestPermission()

      await registerWithEcho(this.notifyClient)
    }
  }

  private formatClientRelatedError(method: string) {
    return `An initialized NotifyClient is required for method: [${method}].`
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'notify_signature_delivered':
        this.emitter.emit('notify_signature_delivered', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  // ------------------- Method-forwarding for NotifyClient -------------------

  public async register(params: { account: string; domain: string; isLimited?: boolean }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('approve'))
    }

    const identityKey = await this.notifyClient.register({
      ...params,
      isLimited: params.isLimited,
      onSign: async message => {
        this.emitter.emit('notify_signature_requested', { message })

        return new Promise(resolve => {
          this.emitter.on(
            'notify_signature_delivered',
            ({ signature: deliveredSyncSignature }: { signature: string }) => {
              resolve(deliveredSyncSignature)
            }
          )
        })
      }
    })

    return identityKey
  }

  public async subscribe(params: { appDomain: string; account: string }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('subscribe'))
    }

    try {
      const subscribed = await this.notifyClient.subscribe({
        ...params
      })

      // Ensure we have a registration with echo (if we need it)
      await this.ensureEchoRegistration()

      return subscribed
    } catch (e: unknown) {
      if (import.meta.env.VITE_ENABLE_MIXPANEL) {
        mixpanel.track(`Failed subscribing: ${JSON.stringify(e)} `)
      }
      throw e
    }
  }

  public async update(params: { topic: string; scope: string[] }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('update'))
    }

    const updated = await this.notifyClient.update(params)

    return updated
  }

  public async deleteSubscription(params: { topic: string }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('deleteSubscription'))
    }

    return this.notifyClient.deleteSubscription(params)
  }

  public async getActiveSubscriptions(params?: { account: string }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('getActiveSubscriptions'))
    }

    const subscriptions = this.notifyClient.getActiveSubscriptions(params)

    return Promise.resolve(subscriptions)
  }

  public async getMessageHistory(params: { topic: string }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('getMessageHistory'))
    }

    const messages = this.notifyClient.getMessageHistory(params)

    return Promise.resolve(messages)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('deleteNotifyMessage'))
    }

    this.notifyClient.deleteNotifyMessage(params)

    return Promise.resolve()
  }

  public async registerWithEcho() {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('registerWithEcho'))
    }

    return registerWithEcho(this.notifyClient)
  }

  public async getRegisteredWithEcho() {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('getRegisteredWithEcho'))
    }

    const [getEchoRegistration] = await getDbEchoRegistrations()

    const existingRegistration = await getEchoRegistration(
      await this.notifyClient.core.crypto.getClientId()
    )

    return Boolean(existingRegistration)
  }
}
