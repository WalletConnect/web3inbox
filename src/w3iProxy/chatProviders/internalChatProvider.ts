import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { EventEmitter } from 'events'
// eslint-disable-next-line no-duplicate-imports
import type ChatClient from '@walletconnect/chat-client'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { W3iChatProvider } from './types'
import { watchAccount, getAccount } from '@wagmi/core'

export default class InternalChatProvider implements W3iChatProvider {
  private chatClient: ChatClient | undefined
  private readonly emitter: EventEmitter
  public providerName = 'InternalChatProvider'
  private readonly methodsListenedTo = ['chat_signature_delivered']

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
    this.chatClient.on('chat_invite_accepted', args =>
      this.emitter.emit('chat_invite_accepted', args)
    )
    this.chatClient.on('chat_invite_rejected', args =>
      this.emitter.emit('chat_invite_rejected', args)
    )
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

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'chat_signature_delivered':
        this.emitter.emit('chat_signature_delivered', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
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

    console.log('internalChatProvider > register > account:', params.account)

    return this.chatClient.register({
      ...params,
      onSign: async message => {
        this.emitter.emit('chat_signature_requested', { message })

        console.log('Currently in the onSign method')

        return new Promise(resolve => {
          this.emitter.once('chat_signature_delivered', ({ signature }: { signature: string }) => {
            console.log('Signature: ', signature)
            resolve(signature)
          })
        })
      }
    })
  }

  public async resolve(params: { account: string }) {
    if (!this.chatClient) {
      throw new Error(this.formatClientRelatedError('resolve'))
    }

    return this.chatClient.resolve(params)
  }
}
