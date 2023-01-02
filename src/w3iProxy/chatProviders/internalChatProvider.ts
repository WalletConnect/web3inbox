import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { EventEmitter } from 'events'
import type ChatClient from '@walletconnect/chat-client'
import type { NextObserver, Observable } from 'rxjs'
import type { ChatFacadeEvents } from '../listenerTypes'
import type { ObservableMap, W3iChat } from './types'
import { fromEvent } from 'rxjs'

export default class InternalChatProvider implements W3iChat {
  private chatClient: ChatClient | undefined
  private readonly emitter: EventEmitter
  private readonly observables: ObservableMap
  public providerName = 'InternalChatProvider'

  public constructor(observables: ObservableMap, emitter: EventEmitter) {
    this.observables = observables
    this.emitter = emitter
  }

  public initState(chatClient: ChatClient) {
    this.chatClient = chatClient
  }

  public get chatMessages() {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('chatMessages'))
    }

    return this.chatClient.chatMessages
  }

  private formatClientRelatedError(method: string) {
    return `An initialized chat client is required for method: [${method}].`
  }

  public async getMessages(params: { topic: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('reject'))
    }
    const queriedMessages = this.chatClient.chatMessages.getAll(params)

    if (queriedMessages.length < 1) {
      return Promise.resolve([] as ChatClientTypes.Message[])
    }

    const { messages: sentAndReceivedMessages } = queriedMessages[0]

    return Promise.resolve(sentAndReceivedMessages)
  }

  public async leave(params: { topic: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('leave'))
    }

    return this.chatClient.leave(params)
  }
  public async reject(params: { id: number }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('reject'))
    }

    return this.chatClient.reject(params)
  }

  public async accept(params: { id: number }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('accept'))
    }

    return this.chatClient.accept(params)
  }
  public async getThreads() {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getThreads'))
    }

    return Promise.resolve(this.chatClient.getThreads())
  }
  public async getInvites() {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getInvites'))
    }

    return Promise.resolve(this.chatClient.getInvites())
  }
  public async invite(params: { account: string; invite: ChatClientTypes.PartialInvite }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('invite'))
    }

    return this.chatClient.invite(params)
  }
  public async ping(params: { topic: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('ping'))
    }

    return this.chatClient.ping(params)
  }
  public async message(params: { topic: string; payload: ChatClientTypes.Message }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('message'))
    }

    await this.chatClient.message(params)

    this.chatClient.emit('chat_message', {
      id: Math.random(),
      params: params.payload,
      topic: params.topic
    })

    return Promise.resolve()
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('register'))
    }

    return this.chatClient.register(params)
  }

  public async resolve(params: { account: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('resolve'))
    }

    return this.chatClient.resolve(params)
  }

  public observe<K extends keyof ChatFacadeEvents>(
    eventName: K,
    observer: NextObserver<ChatFacadeEvents[K]>
  ) {
    if (!this.chatClient) {
      throw new Error('Can not observe internal events when no chat client is initiated')
    }

    const observableExists = this.observables.has(eventName)
    if (!observableExists) {
      this.observables.set(
        eventName,
        fromEvent(this.chatClient, eventName) as Observable<ChatFacadeEvents[K]>
      )
    }
    const eventObservable = this.observables.get(eventName) as Observable<ChatFacadeEvents[K]>

    const subscription = eventObservable.subscribe(observer)

    return subscription.unsubscribe
  }
}
