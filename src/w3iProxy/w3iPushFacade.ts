import { EventEmitter } from 'events'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { fromEvent } from 'rxjs'
import type { PushClientTypes, WalletClient as PushWalletClient } from '@walletconnect/push-client'
import type {
  PushEventObservable,
  PushEventObserver,
  PushObservableMap,
  W3iPush
} from './pushProviders/types'
import ExternalPushProvider from './pushProviders/externalPushProvider'
import InternalPushProvider from './pushProviders/internalPushProvider'
import type { PushFacadeEvents } from './listenerTypes'

class W3iPushFacade implements W3iPush {
  private readonly providerMap = {
    internal: InternalPushProvider,
    external: ExternalPushProvider,
    android: ExternalPushProvider,
    ios: ExternalPushProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly emitter: EventEmitter
  private readonly observables: PushObservableMap

  private readonly provider: ExternalPushProvider | InternalPushProvider

  public constructor(providerName: W3iPushFacade['providerName']) {
    this.providerName = providerName
    this.observables = new Map()
    this.emitter = new EventEmitter()

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

  public on(methodName: string, listener: (data: unknown) => void) {
    this.emitter.on(methodName, listener)
  }

  public async approve(params: { id: number }) {
    return this.provider.approve(params)
  }

  public async reject(params: { id: number; reason: string }) {
    return this.provider.reject(params)
  }

  public async subscribe(params: {
    metadata: PushClientTypes.Metadata
    account: string
    onSign: (message: string) => string
  }) {
    return this.provider.subscribe(params)
  }

  public async deleteSubscription(params: { topic: string }) {
    return this.provider.deleteSubscription(params)
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

  public observe<K extends keyof PushFacadeEvents>(eventName: K, observer: PushEventObserver<K>) {
    const observableExists = this.observables.has(eventName)
    if (!observableExists) {
      this.observables.set(eventName, fromEvent(this.emitter, eventName) as PushEventObservable<K>)
    }
    const eventObservable = this.observables.get(eventName) as PushEventObservable<K>

    const subscription = eventObservable.subscribe(observer)

    return subscription
  }
}

export default W3iPushFacade
