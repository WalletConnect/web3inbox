import { EventEmitter } from 'events'
import type ChatClient from '@walletconnect/chat-client'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { ChatFacadeEvents, EventMessage } from './listenerTypes'
import type { ChatEventObserver, ObservableMap, W3iChat } from './chatProviders/types'
import InternalChatProvider from './chatProviders/internalChatProvider'
import ExternalChatProvider from './chatProviders/externalChatProvider'

class W3iChatFacade implements W3iChat {
  private readonly noClientMode: boolean
  private readonly emitter: EventEmitter
  private readonly observables: ObservableMap
  private readonly provider: ExternalChatProvider | InternalChatProvider

  public constructor(noClientMode: boolean) {
    this.observables = new Map()
    this.noClientMode = noClientMode
    this.emitter = new EventEmitter()
    this.provider = this.noClientMode
      ? new ExternalChatProvider(this.observables, this.emitter)
      : new InternalChatProvider(this.observables, this.emitter)
  }

  public initInternalProvider(chatClient: ChatClient) {
    const internalProvider = this.provider as InternalChatProvider
    console.log({ internalProvider })
    internalProvider.initState(chatClient)
  }

  public postMessage(id: string, messageData: ChatClientTypes.BaseEventArgs<EventMessage>) {
    this.emitter.emit(id, messageData)
  }

  public on(methodName: string, listener: (data: unknown) => void) {
    this.emitter.on(methodName, listener)
  }

  public async leave(params: { topic: string }) {
    return this.provider.leave(params)
  }
  public async reject(params: { id: number }) {
    return this.provider.reject(params)
  }

  public async accept(params: { id: number }) {
    return this.provider.accept(params)
  }
  public async getThreads() {
    return this.provider.getThreads()
  }
  public async getInvites() {
    return this.provider.getInvites()
  }
  public async invite(params: { account: string; invite: ChatClientTypes.PartialInvite }) {
    return this.provider.invite(params)
  }
  public async ping(params: { topic: string }) {
    return this.provider.ping(params)
  }
  public async message(params: { topic: string; payload: ChatClientTypes.Message }) {
    return this.provider.message(params)
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    return this.provider.register(params)
  }

  public async resolve(params: { account: string }) {
    return this.provider.resolve(params)
  }

  public async getMessages(params: { topic: string }) {
    return this.provider.getMessages(params)
  }

  public observe<K extends keyof ChatFacadeEvents>(eventName: K, observer: ChatEventObserver<K>) {
    this.provider.observe(eventName, observer)
  }
}

export default W3iChatFacade
