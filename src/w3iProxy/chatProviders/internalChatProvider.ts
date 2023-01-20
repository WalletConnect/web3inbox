import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { EventEmitter } from 'events'
import type ChatClient from '@walletconnect/chat-client'
import type { W3iChatProvider } from './types'
import { watchAccount, getAccount } from '@wagmi/core'

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
      console.log('GOT INVITE', args)
      this.emitter.emit('chat_invite', args)
    })
    this.chatClient.on('chat_left', args => this.emitter.emit('chat_left', args))
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

  public isListeningToMethodFromPostMessage() {
    return false
  }

  public handleMessage() {
    throw new Error(`${this.providerName} does not support listening to external messages`)
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
  public async getThreads(params?: { account: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getThreads'))
    }

    return Promise.resolve(this.chatClient.getThreads(params))
  }

  public async getPendingThreads() {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('getThreads'))
    }

    return Promise.resolve(this.chatClient.chatThreadsPending.getAll())
  }

  public async getInvites(params?: { account: string }) {
    if (!this.chatClient) {
      console.log({ params })
      throw new Error(this.formatClientRelatedError('getInvites'))
    }

    console.log('Invites: ', this.chatClient.getInvites())

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
}
