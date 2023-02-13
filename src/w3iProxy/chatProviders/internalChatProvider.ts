import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { EventEmitter } from 'events'
import type ChatClient from '@walletconnect/chat-client'
import type { W3iChatProvider } from './types'
import { watchAccount, getAccount, signMessage } from '@wagmi/core'

export default class InternalChatProvider implements W3iChatProvider {
  private chatClient: ChatClient | undefined
  private readonly emitter: EventEmitter
  public providerName = 'InternalChatProvider'

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter

    watchAccount(account => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!account.address || !window.web3inbox.chat) {
        return
      }

      window.web3inbox.chat.postMessage({
        id: Date.now(),
        jsonrpc: '2.0',
        method: 'setAccount',
        params: {
          account: account.address
        }
      })
    })
  }

  /*
   * We need to re-register events from the chat client to the emitter
   * to allow the observers in the facade to work seamlessly.
   */
  public initState(chatClient: ChatClient) {
    this.chatClient = chatClient

    const address: string | undefined = getAccount().address
    if (address) {
      window.web3inbox.chat.postMessage({
        id: Date.now(),
        jsonrpc: '2.0',
        method: 'setAccount',
        params: {
          account: address
        }
      })
    }

    this.chatClient.on('chat_ping', args => this.emitter.emit('chat_ping', args))
    this.chatClient.on('chat_message', args => this.emitter.emit('chat_message', args))
    this.chatClient.on('chat_joined', args => this.emitter.emit('chat_joined', args))
    this.chatClient.on('chat_invite', args => {
      this.emitter.emit('chat_invite', args)
    })
    this.chatClient.on('chat_left', args => this.emitter.emit('chat_left', args))
  }

  private getRequiredInternalAddress(): string {
    const address = getAccount().address
    if (!address) {
      throw new Error('No address registered')
    }

    return address
  }

  public get chatMessages() {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('chatMessages'))
    }

    return this.chatClient.chatMessages
  }

  public addContact(params: { account: string; publicKey: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('chatMessages'))
    }

    this.chatClient.addContact(params)
  }

  private formatClientRelatedError(method: string) {
    return `An initialized chat client is required for method: [${method}].`
  }

  public isListeningToMethodFromPostMessage() {
    return false
  }

  public handleMessage() {
    throw new Error(`${this.providerName} does not support listening to external messages`)
  }

  public async getMessages(params: { topic: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getMessages'))
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
  public async getThreads(params?: { account: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getThreads'))
    }

    return Promise.resolve(this.chatClient.getThreads(params))
  }

  public async getPendingThreads() {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getPendingThreads'))
    }

    return Promise.resolve(this.chatClient.chatThreadsPending.getAll())
  }

  public async getSentInvites(params?: { account: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getSentInvites'))
    }

    return Promise.resolve(
      this.chatClient.getSentInvites(params ?? { account: this.getRequiredInternalAddress() })
    )
  }

  public async getReceivedInvites(params?: { account: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getReceivedInvites'))
    }

    return Promise.resolve(
      this.chatClient.getReceivedInvites(params ?? { account: this.getRequiredInternalAddress() })
    )
  }

  public async invite(params: ChatClientTypes.Invite) {
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
  public async message(params: ChatClientTypes.Message) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('message'))
    }

    await this.chatClient.message(params)

    return Promise.resolve()
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('register'))
    }

    return this.chatClient.register({
      ...params,
      onSign: async message => signMessage({ message })
    })
  }

  public async resolve(params: { account: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('resolve'))
    }

    return this.chatClient.resolve(params)
  }
}
