import { EventEmitter } from 'events'
import type ChatClient from '@walletconnect/chat-client'
// eslint-disable-next-line no-duplicate-imports
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
import { distinct, filter, from, ReplaySubject, throwError, timeout } from 'rxjs'
// eslint-disable-next-line no-duplicate-imports
import { fromEvent } from 'rxjs'
import { ONE_DAY } from '@walletconnect/time'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'

type ReplayMessage = ChatClientTypes.Message & {
  id: string
  originalTimestamp: number
  count: number
}

class W3iChatFacade implements W3iChat {
  private readonly providerMap = {
    internal: InternalChatProvider,
    external: ExternalChatProvider,
    ios: ExternalChatProvider,
    android: ExternalChatProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly messageReplaySubject: ReplaySubject<ReplayMessage>
  private readonly emitter: EventEmitter
  private readonly observables: ObservableMap
  private readonly provider: ExternalChatProvider | InternalChatProvider
  private readonly messageSendTimeout = 5000
  private account?: string

  public constructor(providerName: W3iChatFacade['providerName']) {
    this.providerName = providerName
    this.observables = new Map()
    this.emitter = new EventEmitter()

    const ProviderClass = this.providerMap[this.providerName]
    this.provider = new ProviderClass(this.emitter, providerName)

    // Discuss expiry of messages
    this.messageReplaySubject = new ReplaySubject(undefined, ONE_DAY / 2)
    this.handleMessagePublishing()
  }

  private handleMessagePublishing() {
    // Stop trying to resend the message after 3 tries.
    this.messageReplaySubject.pipe(filter(params => params.count < 3)).subscribe(params => {
      from(this.provider.message(params))
        .pipe(
          timeout({
            first: this.messageSendTimeout,
            with: () => throwError(() => new Error())
          })
        )
        .subscribe({
          next: () => {
            this.emitter.emit('chat_message_sent', {
              ...params
            })
          },
          error: () => {
            /*
             * Create arbitrary delay.
             * The timestamp is updated to be the current time.
             */
            setTimeout(() => {
              this.messageReplaySubject.next({
                ...params,
                count: params.count + 1,
                timestamp: Date.now()
              })
            }, this.messageSendTimeout * 1.25)
          }
        })
    })
  }

  /*
   * Messages that are not in the chat client due to them not being
   * successfully sent.
   */
  public getUnsentMessages() {
    const messages: ChatClientTypes.Message[] = []
    const sub = this.messageReplaySubject
      .pipe(distinct<ReplayMessage, string>(({ id }) => id))
      .subscribe(messages.push)

    sub.unsubscribe()

    return messages
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
    this.messageReplaySubject.next({
      ...params,
      originalTimestamp: params.timestamp,
      id: `${params.message}${params.timestamp}${params.authorAccount}`,
      count: 0
    })

    return Promise.resolve()
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

    return subscription
  }
}

export default W3iChatFacade
