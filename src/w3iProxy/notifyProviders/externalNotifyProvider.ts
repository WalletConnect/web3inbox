import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { EventEmitter } from 'events'

import { AndroidCommunicator } from '@/w3iProxy/externalCommunicators/androidCommunicator'
import type { ExternalCommunicator } from '@/w3iProxy/externalCommunicators/communicatorType'
import { IOSCommunicator } from '@/w3iProxy/externalCommunicators/iosCommunicator'
import { JsCommunicator } from '@/w3iProxy/externalCommunicators/jsCommunicator'
import { ReactNativeCommunicator } from '@/w3iProxy/externalCommunicators/reactNativeCommunicator'

import type { NotifyClientFunctions, W3iNotifyProvider } from './types'

export default class ExternalNotifyProvider implements W3iNotifyProvider {
  protected readonly emitter: EventEmitter
  private readonly methodsListenedTo = [
    'notify_subscription',
    'notify_subscriptions_changed',
    'notify_message',
    'notify_update',
    'notify_delete',
    'sync_update'
  ]
  public providerName = 'ExternalNotifyProvider'
  protected readonly communicator: ExternalCommunicator

  /*
   * We have no need to register events here like we do in internal provider
   * because the events come through the emitter anyway.
   */
  public constructor(emitter: EventEmitter, name: string) {
    this.emitter = emitter
    switch (name) {
      case 'android':
        this.communicator = new AndroidCommunicator(this.emitter)
        break
      case 'ios':
        this.communicator = new IOSCommunicator(this.emitter)
        break
      case 'reactnative':
        this.communicator = new ReactNativeCommunicator(this.emitter, 'notify')
        break
      default:
        this.communicator = new JsCommunicator(this.emitter)
        break
    }
  }

  protected async postToExternalProvider<MName extends keyof NotifyClientFunctions>(
    methodName: MName,
    ...params: Parameters<NotifyClientFunctions[MName]>
  ) {
    return this.communicator.postToExternalProvider<ReturnType<NotifyClientFunctions[MName]>>(
      methodName,
      params[0],
      'notify'
    )
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'notify_subscription':
      case 'notify_subscriptions_changed':
      case 'notify_message':
      case 'notify_update':
      case 'notify_delete':
      case 'sync_update':
        this.emitter.emit(request.method, request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  public async register(params: { account: string; domain: string; isLimited?: boolean }) {
    return this.postToExternalProvider('register', {
      account: params.account,
      isLimited: params.isLimited,
      domain: params.domain,
      // Signing will be handled wallet-side.
      onSign: async () => Promise.resolve('')
    })
  }

  public async subscribe(params: { appDomain: string; account: string }) {
    return this.postToExternalProvider('subscribe', {
      ...params
    })
  }

  public async update(params: { topic: string; scope: string[] }) {
    return this.postToExternalProvider('update', params)
  }

  public async deleteSubscription(params: { topic: string }) {
    return this.postToExternalProvider('deleteSubscription', params)
  }

  public async getActiveSubscriptions(params?: { account: string }) {
    return this.postToExternalProvider('getActiveSubscriptions', params)
  }

  public async getMessageHistory(params: { topic: string }) {
    return this.postToExternalProvider('getMessageHistory', params)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    return this.postToExternalProvider('deleteNotifyMessage', params)
  }

  public async registerWithEcho() {
    return Promise.reject('External notify provider can not register with echo')
  }

  public async getRegisteredWithEcho() {
    return Promise.resolve(false)
  }
}
