import { EventEmitter } from 'events'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type ChatClient from '@walletconnect/chat-client'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { ChatFacadeEvents } from './listenerTypes'
import type {
  ChatEventObservable,
  ChatEventObserver,
  ObservableMap,
  W3iChat
} from './chatProviders/types'
import InternalChatProvider from './chatProviders/internalChatProvider'
import ExternalChatProvider from './chatProviders/externalChatProvider'
import { fromEvent } from 'rxjs'
import AndroidChatProvider from './chatProviders/androidChatProvider'
import iOSChatProvider from './chatProviders/iosChatProvider'

class W3iChatFacade implements W3iChat {
  private readonly providerMap = {
    internal: InternalChatProvider,
    external: ExternalChatProvider,
    android: AndroidChatProvider,
    ios: iOSChatProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly emitter: EventEmitter
  private readonly observables: ObservableMap
  private readonly provider: ExternalChatProvider | InternalChatProvider
  private account?: string

  public constructor(providerName: W3iChatFacade['providerName']) {
    this.providerName = providerName
    this.observables = new Map()
    this.emitter = new EventEmitter()

    const ProviderClass = this.providerMap[this.providerName]
    this.provider = new ProviderClass(this.emitter)
  }

  public initInternalProvider(chatClient: ChatClient) {
    const internalProvider = this.provider as InternalChatProvider
    internalProvider.initState(chatClient)
  }

  // Method to be used by external providers. Not internal use.
  public postMessage(messageData: JsonRpcRequest<unknown>) {
    this.emitter.emit(messageData.id.toString(), messageData)
    switch (messageData.method) {
      case 'setAccount':
        this.account = (messageData.params as { account: string }).account
        this.emitter.emit('chat_account_change', messageData.params)
        break
      default:
        if (this.provider.isListeningToMethodFromPostMessage(messageData.method)) {
          this.provider.handleMessage(messageData)
        }
    }
  }

  public getAccount() {
    return this.account
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
  public async getThreads(params?: { account: string }) {
    return this.provider.getThreads(params)
  }

  public async getSentInvites(params?: { account: string }) {
    const account = params?.account ?? this.account
    if (!account) {
      throw new Error(
        "An account param must be provided, or an account must've been set for getSentInvites"
      )
    }

    return this.provider.getSentInvites({ account })
  }

  public async getReceivedInvites(params?: { account: string }) {
    const account = params?.account ?? this.account
    if (!account) {
      throw new Error(
        "An account param must be provided, or an account must've been set for getReceivedInvites"
      )
    }

    return this.provider.getReceivedInvites({ account })
  }

  public addContact(params: { account: string; publicKey: string }) {
    return this.provider.addContact(params)
  }

  public async invite(params: ChatClientTypes.Invite) {
    return this.provider.invite(params).then(inviteId => {
      this.emitter.emit('chat_invite_sent', {
        ...params
      })

      return inviteId
    })
  }
  public async ping(params: { topic: string }) {
    return this.provider.ping(params)
  }
  public async message(params: ChatClientTypes.Message) {
    return this.provider.message(params).then(() => {
      this.emitter.emit('chat_message_sent', {
        ...params
      })
    })
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
    const observableExists = this.observables.has(eventName)
    if (!observableExists) {
      this.observables.set(eventName, fromEvent(this.emitter, eventName) as ChatEventObservable<K>)
    }
    const eventObservable = this.observables.get(eventName) as ChatEventObservable<K>

    const subscription = eventObservable.subscribe(observer)

    return subscription.unsubscribe
  }
}

export default W3iChatFacade
