import { EventEmitter } from 'events'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { PushClientTypes, WalletClient as PushWalletClient } from '@walletconnect/push-client'
import type { W3iPush } from './pushProviders/types'
import ExternalPushProvider from './pushProviders/externalPushProvider'
import InternalPushProvider from './pushProviders/internalPushProvider'
import type { PushFacadeEvents } from './listenerTypes'
import { ObservablesController } from './observablesController'

class W3iPushFacade implements W3iPush {
  private readonly providerMap = {
    internal: InternalPushProvider,
    external: ExternalPushProvider,
    android: ExternalPushProvider,
    reactnative: ExternalPushProvider,
    ios: ExternalPushProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly emitter: EventEmitter
  private readonly observablesController: ObservablesController<PushFacadeEvents>
  private readonly provider: ExternalPushProvider | InternalPushProvider

  public constructor(providerName: W3iPushFacade['providerName']) {
    this.providerName = providerName
    this.emitter = new EventEmitter()
    this.observablesController = new ObservablesController(this.emitter)

    const ProviderClass = this.providerMap[this.providerName]
    this.provider = new ProviderClass(this.emitter, providerName)
  }

  public initInternalProvider(pushClient: PushWalletClient) {
    const internalProvider = this.provider as InternalPushProvider
    internalProvider.initState(pushClient)
  }

  // Method to be used by external providers. Not internal use.
  public postMessage(messageData: JsonRpcRequest<unknown>) {
    this.emitter.emit(messageData.id.toString(), messageData)
    if (this.provider.isListeningToMethodFromPostMessage(messageData.method)) {
      this.provider.handleMessage(messageData)
    }
  }

  public get observe() {
    return this.observablesController.observe
  }

  public get observeOne() {
    return this.observablesController.observeOne
  }

  // ------------------ Push Client Forwarding ------------------

  public async approve(params: { id: number }) {
    return this.provider.approve(params)
  }

  public async reject(params: { id: number; reason: string }) {
    return this.provider.reject(params)
  }

  public async subscribe(params: { metadata: PushClientTypes.Metadata; account: string }) {
    return this.provider.subscribe(params)
  }

  public async update(params: { topic: string; scope: string[] }) {
    return this.provider.update(params)
  }

  public async deleteSubscription(params: { topic: string }) {
    return this.provider.deleteSubscription(params).then(() => {
      this.emitter.emit('push_delete', {})
    })
  }

  public async getActiveSubscriptions() {
    return this.provider.getActiveSubscriptions()
  }

  public async getMessageHistory(params: { topic: string }) {
    return this.provider.getMessageHistory(params)
  }

  public async deletePushMessage(params: { id: number }) {
    return this.provider.deletePushMessage(params)
  }
}

export default W3iPushFacade
