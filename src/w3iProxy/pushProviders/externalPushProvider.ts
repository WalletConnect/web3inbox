import type { EventEmitter } from 'events'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { PushClientTypes } from '@walletconnect/push-client'
import type { PushClientFunctions, W3iPushProvider } from './types'
import type { ExternalCommunicator } from '../externalCommunicators/communicatorType'
import { AndroidCommunicator } from '../externalCommunicators/androidCommunicator'
import { IOSCommunicator } from '../externalCommunicators/iosCommunicator'
import { JsCommunicator } from '../externalCommunicators/jsCommunicator'
import { ReactNativeCommunicator } from '../externalCommunicators/reactNativeCommunicator'

export default class ExternalPushProvider implements W3iPushProvider {
  protected readonly emitter: EventEmitter
  private readonly methodsListenedTo = [
    'push_request',
    'push_subscription',
    'push_message',
    'push_update',
    'push_delete'
  ]
  public providerName = 'ExternalPushProvider'
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
        this.communicator = new ReactNativeCommunicator(this.emitter)
        break
      default:
        this.communicator = new JsCommunicator(this.emitter)
        break
    }
  }

  protected async postToExternalProvider<MName extends keyof PushClientFunctions>(
    methodName: MName,
    ...params: Parameters<PushClientFunctions[MName]>
  ) {
    return this.communicator.postToExternalProvider<ReturnType<PushClientFunctions[MName]>>(
      methodName,
      params[0],
      'push'
    )
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    console.log({ request })
    switch (request.method) {
      case 'push_request':
      case 'push_subscription':
      case 'push_message':
      case 'push_update':
      case 'push_delete':
        this.emitter.emit(request.method, request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  public async approve(params: { id: number }) {
    return this.postToExternalProvider('approve', {
      ...params,
      // Signing will be handled wallet-side.
      onSign: async () => Promise.resolve('')
    })
  }

  public async reject(params: { id: number; reason: string }) {
    return this.postToExternalProvider('reject', params)
  }

  public async subscribe(params: { metadata: PushClientTypes.Metadata; account: string }) {
    return this.postToExternalProvider('subscribe', {
      ...params,
      // Signing will be handled wallet-side.
      onSign: async () => Promise.resolve('')
    })
  }

  public async update(params: { topic: string; scope: string[] }) {
    return this.postToExternalProvider('update', params)
  }

  public async deleteSubscription(params: { topic: string }) {
    return this.postToExternalProvider('deleteSubscription', params)
  }

  public async getActiveSubscriptions() {
    return this.postToExternalProvider('getActiveSubscriptions')
  }

  public async getMessageHistory(params: { topic: string }) {
    return this.postToExternalProvider('getMessageHistory', params)
  }

  public async deletePushMessage(params: { id: number }) {
    return this.postToExternalProvider('deletePushMessage', params)
  }
}
