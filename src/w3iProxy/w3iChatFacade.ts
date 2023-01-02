import { fromEvent } from 'rxjs'
import { EventEmitter } from 'events'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type ChatClient from '@walletconnect/chat-client'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { NextObserver, Observable } from 'rxjs'
import type { ChatFacadeEvents, EventMessage } from './listenerTypes'
import type { W3iChat } from './chatProviders/types'

class W3iChatFacade implements W3iChat {
  private chatClient: ChatClient | undefined
  private readonly noClientMode: boolean
  private readonly emitter: EventEmitter

  private readonly observables: Map<
    keyof ChatFacadeEvents,
    Observable<ChatFacadeEvents[keyof ChatFacadeEvents]>
  >

  public constructor(noClientMode: boolean) {
    this.observables = new Map()
    this.noClientMode = noClientMode
    this.emitter = new EventEmitter()
  }

  public postMessage(id: string, messageData: ChatClientTypes.BaseEventArgs<EventMessage>) {
    this.emitter.emit(id, messageData.params)
  }

  public on(methodName: string, listener: (data: unknown) => void) {
    this.emitter.on(methodName, listener)
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

  public initState(chatClient: ChatClient) {
    this.chatClient = chatClient
  }
  public async getMessages(params: { topic: string }) {
    if (this.noClientMode) {
      return new Promise(resolve => {
        const getMessagesRequest = formatJsonRpcRequest('getMessages', params)
        const getMessagesListener = (
          getMessagesResponse: ReturnType<ChatClient['getMessages']>
        ) => {
          resolve(getMessagesResponse)
        }
        this.emitter.once(getMessagesRequest.id.toString(), getMessagesListener)
        this.emitter.emit('getMessages', getMessagesRequest)
      })
    }

    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('reject'))
    }
    const queriedMessages = this.chatClient.chatMessages.getAll(params)

    if (queriedMessages.length < 1) {
      return [] as ChatClientTypes.Message[]
    }

    const { messages: sentAndReceivedMessages } = queriedMessages[0]

    return sentAndReceivedMessages
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
  public getThreads() {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getThreads'))
    }

    console.log('Threads', this.chatClient.getThreads())

    return this.chatClient.getThreads()
  }
  public getInvites() {
    if (this.chatClient) {
      return this.chatClient.getInvites()
    }

    return new Map<number, ChatClientTypes.Invite>()
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

export default W3iChatFacade
