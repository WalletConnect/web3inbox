import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { EventEmitter } from 'events'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NextObserver, Observable } from 'rxjs'
import type { ChatFacadeEvents } from '../listenerTypes'
import type { ChatClientFunctions, ObservableMap, W3iChat } from './types'
import { fromEvent } from 'rxjs'
import type ChatClient from '@walletconnect/chat-client/'

export default class ExternalChatProvider implements W3iChat {
  private readonly emitter: EventEmitter
  private readonly observables: ObservableMap
  public providerName = 'ExternalChatProvider'

  public constructor(observables: ObservableMap, emitter: EventEmitter) {
    this.observables = observables
    this.emitter = emitter
  }

  private async postToExternalProvider<MName extends keyof ChatClientFunctions>(
    methodName: MName,
    ...params: Parameters<ChatClientFunctions[MName]>
  ) {
    return new Promise<ReturnType<ChatClientFunctions[MName]>>(resolve => {
      const message = formatJsonRpcRequest(methodName, params)

      const messageListener = (
        messageResponse: JsonRpcResult<ReturnType<ChatClientFunctions[MName]>>
      ) => {
        console.log({ messageResponse })
        resolve(messageResponse.result)
      }
      this.emitter.once(message.id.toString(), messageListener)
      this.emitter.emit(methodName, message)
    })
  }

  public async getMessages(params: { topic: string }) {
    return this.postToExternalProvider('getMessages', params)
  }

  public async leave(params: { topic: string }) {
    return this.postToExternalProvider('leave', params)
  }
  public async reject(params: { id: number }) {
    return this.postToExternalProvider('reject', params)
  }

  public async accept(params: { id: number }) {
    return this.postToExternalProvider('accept', params)
  }
  public async getThreads() {
    return this.postToExternalProvider('getThreads')
  }
  public async getInvites() {
    return this.postToExternalProvider('getInvites')
  }
  public async invite(params: { account: string; invite: ChatClientTypes.PartialInvite }) {
    return this.postToExternalProvider('invite', params)
  }
  public async ping(params: { topic: string }) {
    return this.postToExternalProvider('ping', params)
  }
  public async message(params: { topic: string; payload: ChatClientTypes.Message }) {
    return this.postToExternalProvider('message', params)

    /*
     * Rewrite this to central emitter
     * this.chatClient.emit('chat_message', {
     *   id: Math.random(),
     *   params: params.payload,
     *   topic: params.topic
     * })
     */

    return Promise.resolve()
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    return this.postToExternalProvider('register', params)
  }

  public async resolve(params: { account: string }) {
    return this.postToExternalProvider('resolve', params)
  }

  public observe<K extends keyof ChatFacadeEvents>(
    eventName: K,
    observer: NextObserver<ChatFacadeEvents[K]>
  ) {
    const observableExists = this.observables.has(eventName)
    if (!observableExists) {
      this.observables.set(
        eventName,
        fromEvent(this.emitter, eventName) as Observable<ChatFacadeEvents[K]>
      )
    }
    const eventObservable = this.observables.get(eventName) as Observable<ChatFacadeEvents[K]>

    const subscription = eventObservable.subscribe(observer)

    return subscription.unsubscribe
  }
}
