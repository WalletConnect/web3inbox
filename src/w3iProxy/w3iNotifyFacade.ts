import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient } from '@walletconnect/notify-client'
import { EventEmitter } from 'events'

import type { NotifyFacadeEvents } from './listenerTypes'
import ExternalNotifyProvider from './notifyProviders/externalNotifyProvider'
import InternalNotifyProvider from './notifyProviders/internalNotifyProvider'
import type { W3iNotify } from './notifyProviders/types'
import { ObservablesController } from './observablesController'

class W3iNotifyFacade implements W3iNotify {
  private readonly providerMap = {
    internal: InternalNotifyProvider,
    external: ExternalNotifyProvider,
    android: ExternalNotifyProvider,
    reactnative: ExternalNotifyProvider,
    ios: ExternalNotifyProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly emitter: EventEmitter
  private readonly observablesController: ObservablesController<NotifyFacadeEvents>
  private readonly provider: ExternalNotifyProvider | InternalNotifyProvider

  public constructor(providerName: W3iNotifyFacade['providerName']) {
    this.providerName = providerName
    this.emitter = new EventEmitter()
    this.observablesController = new ObservablesController(this.emitter)

    const ProviderClass = this.providerMap[this.providerName]
    this.provider = new ProviderClass(this.emitter, providerName)
  }

  public initInternalProvider(notifyClient: NotifyClient) {
    const internalProvider = this.provider as InternalNotifyProvider
    internalProvider.initState(notifyClient)
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

  // ------------------ Notify Client Forwarding ------------------

  public async register(params: { account: string; domain: string; isLimited?: boolean }) {
    return this.provider.register(params)
  }

  public async subscribe(params: { appDomain: string; account: string }) {
    return this.provider.subscribe(params)
  }

  public async update(params: { topic: string; scope: string[] }) {
    return this.provider.update(params)
  }

  public async deleteSubscription(params: { topic: string }) {
    return this.provider.deleteSubscription(params).then(() => {
      this.emitter.emit('notify_delete', {})
    })
  }

  public async getActiveSubscriptions(params?: { account: string }) {
    return this.provider.getActiveSubscriptions(params)
  }

  public async getMessageHistory(params: { topic: string }) {
    return this.provider.getMessageHistory(params)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    return this.provider.deleteNotifyMessage(params)
  }

  public async registerWithEcho() {
    return this.provider.registerWithEcho()
  }

  public async getRegisteredWithEcho() {
    return this.provider.getRegisteredWithEcho()
  }
}

export default W3iNotifyFacade
