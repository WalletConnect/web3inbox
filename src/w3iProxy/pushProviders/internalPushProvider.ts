import type { PushClientTypes, WalletClient as PushWalletClient } from '@walletconnect/push-client'
import type { EventEmitter } from 'events'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { W3iPushProvider } from './types'
import { getToken } from 'firebase/messaging'
import { messaging } from '../../utils/firebase'

export default class InternalPushProvider implements W3iPushProvider {
  private pushClient: PushWalletClient | undefined
  private readonly emitter: EventEmitter
  public providerName = 'InternalPushProvider'
  private readonly methodsListenedTo = ['push_signature_delivered']

  public constructor(emitter: EventEmitter, _name = 'internal') {
    this.emitter = emitter
  }

  /*
   * We need to re-register events from the chat client to the emitter
   * to allow the observers in the facade to work seamlessly.
   */
  public initState(pushClient: PushWalletClient) {
    this.pushClient = pushClient

    this.pushClient.on('push_proposal', args => this.emitter.emit('push_request', args))
    this.pushClient.on('push_subscription', args => this.emitter.emit('push_subscription', args))
    this.pushClient.on('push_message', args => this.emitter.emit('push_message', args))
    this.pushClient.on('push_update', args => this.emitter.emit('push_update', args))
    this.pushClient.on('push_delete', args => this.emitter.emit('push_delete', args))

    this.pushClient.syncClient.on('sync_update', () => {
      this.emitter.emit('sync_update', {})
    })

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
      case 'push_signature_delivered':
        this.emitter.emit('push_signature_delivered', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  // ------------------- Method-forwarding for PushWalletClient -------------------

  public async enableSync(params: { account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('approve'))
    }

    const alreadySynced = this.pushClient.syncClient.signatures.getAll({
      account: params.account
    }).length

    if (alreadySynced) {
      return Promise.resolve()
    }

    return this.pushClient.enableSync({
      ...params,
      onSign: async message => {
        this.emitter.emit('push_signature_requested', { message })

        return new Promise(resolve => {
          const intervalId = setInterval(() => {
            const signatureForAccountExists = this.pushClient?.syncClient.signatures.getAll({
              account: params.account
            })?.length
            if (this.pushClient && signatureForAccountExists) {
              const { signature } = this.pushClient.syncClient.signatures.get(params.account)
              this.emitter.emit('push_signature_request_cancelled', {})
              clearInterval(intervalId)
              resolve(signature)
            }
          }, 100)

          this.emitter.on('push_signature_delivered', ({ signature }: { signature: string }) => {
            resolve(signature)
          })
        })
      }
    })
  }

  public async approve(params: { id: number }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('approve'))
    }

    return this.pushClient.approve({
      ...params,
      onSign: async message =>
        window.web3inbox.signMessage(message).then(signature => {
          console.log('PushClient.approve > onSign > signature', signature)

          return signature
        })
    })
  }

  public async reject(params: { id: number; reason: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('reject'))
    }

    return this.pushClient.reject(params)
  }

  public async subscribe(params: { metadata: PushClientTypes.Metadata; account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('subscribe'))
    }
    console.log('InternalPushProvider > PushClient.subscribe > params', params)

    Notification.requestPermission()

    console.log('Got permission')

    const clientId = await this.pushClient.core.crypto.getClientId()

    console.log('Got clientId', clientId)

    const token = await getToken(messaging, {
      vapidKey:
        'BCnI0mkpH3LvHRF-dREPCdvBFk24oveWy4JBuINzWcu8JXhmCDkczDmHM9RubzsQrv60UKFk-MKozVjRRzvx1X4'
    })

    console.log('Got token', token)

    const subscribed = await this.pushClient.subscribe({
      ...params,
      onSign: async message =>
        window.web3inbox.signMessage(message).then(signature => {
          console.log('PushClient.subscribe > onSign > signature', signature)

          return signature
        })
    })

    console.log({ subscribed })

    const symkey = this.pushClient.subscriptions
      .getAll({
        account: params.account
      })
      .find(sub => sub.metadata.url === params.metadata.url)?.symKey

    console.log({ symkey })

    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({
        type: 'INSTALL_SYMKEY_CLIENT',
        clientId,
        token,
        symkey
      })
    })

    return subscribed
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

  public async deletePushMessage(params: { id: number }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('deletePushMessage'))
    }

    this.pushClient.deletePushMessage(params)

    return Promise.resolve()
  }
}
