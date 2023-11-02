import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient } from '@walletconnect/notify-client'
import type { EventEmitter } from 'events'
import mixpanel from 'mixpanel-browser'
import type { W3iNotifyProvider } from './types'
import { setupPushNotifications } from '../../utils/notifications'

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
    this.notifyClient = notifyClient

    this.notifyClient.on('notify_subscription', args =>
      this.emitter.emit('notify_subscription', args)
    )
    this.notifyClient.on('notify_message', args => this.emitter.emit('notify_message', args))
    this.notifyClient.on('notify_subscriptions_changed', args =>
      this.emitter.emit('notify_subscriptions_changed', args)
    )
    this.notifyClient.on('notify_update', args => this.emitter.emit('notify_update', args))
    this.notifyClient.on('notify_delete', args => this.emitter.emit('notify_delete', args))

    this.notifyClient.subscriptions.core.on('sync_store_update', () => {
      this.emitter.emit('sync_update', {})
    })
  }

  // ------------------------ Provider-specific methods ------------------------

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
    console.log('InternalNotifyProvider > NotifyClient.subscribe > params', params)

    /*
     * To prevent subscribing in local/dev environemntns failing,
     * no calls to the service worker or firebase messager worker
     * will be made.
     */

    try {
      const subscribed = await this.notifyClient.subscribe({
        ...params
      })

      try {
	await setupPushNotifications(this.notifyClient, params.appDomain);
      }
      catch (e) {
	console.error(e);
      }

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

    console.log(
      'InternalNotifyProvider > NotifyClient.getActiveSubscriptions > subscriptions',
      subscriptions
    )

    return Promise.resolve(subscriptions)
  }

  public async getMessageHistory(params: { topic: string }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('getMessageHistory'))
    }

    const messages = this.notifyClient.getMessageHistory(params)

    console.log('InternalNotifyProvider > NotifyClient.getMessageHistory > messages', messages)

    return Promise.resolve(messages)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    if (!this.notifyClient) {
      throw new Error(this.formatClientRelatedError('deleteNotifyMessage'))
    }

    this.notifyClient.deleteNotifyMessage(params)

    return Promise.resolve()
  }
}
