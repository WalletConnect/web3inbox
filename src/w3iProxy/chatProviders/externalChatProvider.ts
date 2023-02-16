import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { EventEmitter } from 'events'
import type { JsonRpcRequest, JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { ChatClientFunctions, W3iChatProvider } from './types'

export default class ExternalChatProvider implements W3iChatProvider {
  protected readonly emitter: EventEmitter
  private readonly methodsListenedTo = [
    'chat_message',
    'chat_invite',
    'chat_joined',
    'chat_left',
    'chat_ping',
    'chat_set_account'
  ]
  public providerName = 'ExternalChatProvider'

  /*
   * We have no need to register events here like we do in internal provider
   * because the events come through the emitter anyway.
   */
  public constructor(emitter: EventEmitter) {
    this.emitter = emitter
  }

  protected async postToExternalProvider<MName extends keyof ChatClientFunctions>(
    methodName: MName,
    ...params: Parameters<ChatClientFunctions[MName]>
  ) {
    return new Promise<ReturnType<ChatClientFunctions[MName]>>(resolve => {
      const message = formatJsonRpcRequest(methodName, params)

      const messageListener = (
        messageResponse: JsonRpcResult<ReturnType<ChatClientFunctions[MName]>>
      ) => {
        resolve(messageResponse.result)
      }
      this.emitter.once(message.id.toString(), messageListener)
      this.emitter.emit(methodName, message)
    })
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    console.log({ request })
    switch (request.method) {
      case 'chat_message':
      case 'chat_ping':
      case 'chat_joined':
      case 'chat_invite':
      case 'chat_left':
        this.emitter.emit(request.method, request.params)
        break
      case 'chat_set_account':
        throw new Error('Setting an account externally is not supported yet')
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
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
  public async getThreads(params?: { account: string }) {
    return this.postToExternalProvider('getThreads', params)
  }

  public async getPendingThreads(params?: { account: string }) {
    return this.postToExternalProvider('getPendingThreads', params)
  }

  public async getSentInvites(params: { account: string }) {
    return this.postToExternalProvider('getSentInvites', params)
  }

  public async getReceivedInvites(params: { account: string }) {
    return this.postToExternalProvider('getReceivedInvites', params)
  }

  public async addContact(params: { account: string; publicKey: string }) {
    return this.postToExternalProvider('addContact', params)
  }

  public async invite(params: ChatClientTypes.Invite) {
    return this.postToExternalProvider('invite', params)
  }
  public async ping(params: { topic: string }) {
    return this.postToExternalProvider('ping', params)
  }
  public async message(params: ChatClientTypes.Message) {
    return this.postToExternalProvider('message', params)
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    return this.postToExternalProvider('register', {
      ...params,
      // Signing will be handled wallet-side.
      onSign: async () => Promise.resolve('')
    })
  }

  public async resolve(params: { account: string }) {
    return this.postToExternalProvider('resolve', params)
  }
}
