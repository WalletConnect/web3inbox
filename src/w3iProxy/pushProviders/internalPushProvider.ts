import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient } from '@walletconnect/notify-client'
import type { EventEmitter } from 'events'
import mixpanel from 'mixpanel-browser'
import type { W3iPushProvider } from './types'

export default class InternalPushProvider implements W3iPushProvider {
  private pushClient: NotifyClient | undefined
  private readonly emitter: EventEmitter
  public providerName = 'InternalPushProvider'
  private readonly methodsListenedTo = ['notify_signature_delivered']

  public constructor(emitter: EventEmitter, _name = 'internal') {
    this.emitter = emitter
  }

  /*
   * We need to re-register events from the chat client to the emitter
   * to allow the observers in the facade to work seamlessly.
   */
  public initState(pushClient: NotifyClient) {
    this.pushClient = pushClient

    this.pushClient.on('notify_subscription', args =>
      this.emitter.emit('notify_subscription', args)
    )
    this.pushClient.on('notify_message', args => this.emitter.emit('notify_message', args))
    this.pushClient.on('notify_subscriptions_changed', args =>
      this.emitter.emit('notif_subscriptions_changed', args)
    )
    this.pushClient.on('notify_update', args => this.emitter.emit('notify_update', args))
    this.pushClient.on('notify_delete', args => this.emitter.emit('notify_delete', args))

    this.pushClient.subscriptions.core.on('sync_store_update', () => {
      this.emitter.emit('sync_update', {})
    })
  }

  // ------------------------ Provider-specific methods ------------------------

  private formatClientRelatedError(method: string) {
    return `An initialized PushClient is required for method: [${method}].`
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

  public async register(params: { account: string; domain: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('approve'))
    }

    const identityKey = await this.pushClient.register({
      ...params,
      isLimited: false,
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
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('subscribe'))
    }
    console.log('InternalPushProvider > PushClient.subscribe > params', params)

    /*
     * To prevent subscribing in local/dev environemntns failing,
     * no calls to the service worker or firebase messager worker
     * will be made.
     */

    try {
      const subscribed = await this.pushClient.subscribe({
        ...params
      })

      return subscribed
    } catch (e: unknown) {
      mixpanel.track(`Failed subscribing: ${JSON.stringify(e)} `)
      throw e
    }
  }

  public async update(params: { topic: string; scope: string[] }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('update'))
    }

    const updated = await this.pushClient.update(params)

    return updated
  }

  public async deleteSubscription(params: { topic: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('deleteSubscription'))
    }

    return this.pushClient.deleteSubscription(params)
  }

  public async getActiveSubscriptions(params?: { account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('getActiveSubscriptions'))
    }

    const subscriptions = this.pushClient.getActiveSubscriptions(params)

    console.log(
      'InternalPushProvider > PushClient.getActiveSubscriptions > subscriptions',
      subscriptions
    )

    return Promise.resolve(this.pushClient.getActiveSubscriptions())
  }

  public async getMessageHistory(params: { topic: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('getMessageHistory'))
    }

    const messages = this.pushClient.getMessageHistory(params)

    console.log('InternalPushProvider > PushClient.getMessageHistory > messages', messages)

    return Promise.resolve(messages)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('deleteNotifyMessage'))
    }

    this.pushClient.deleteNotifyMessage(params)

    return Promise.resolve()
  }
}
