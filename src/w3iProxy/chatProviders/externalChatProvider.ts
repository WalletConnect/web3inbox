import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { EventEmitter } from 'events'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { ChatClientFunctions, W3iChat } from './types'

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        web3inbox?: {
          postMessage: (message: unknown) => void
        }
      }
    }
  }
}

export default class ExternalChatProvider implements W3iChat {
  private readonly emitter: EventEmitter
  public providerName = 'ExternalChatProvider'

  /*
   * We have no need to register events here like we do in internal provider
   * because the events come through the emitter anyway.
   */
  public constructor(emitter: EventEmitter) {
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
        resolve(messageResponse.result)
      }
      this.emitter.once(message.id.toString(), messageListener)
      if (window.webkit?.messageHandlers?.web3inbox) {
        window.webkit.messageHandlers.web3inbox.postMessage({
          ...message,
          methodName
        })
      }
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
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    return this.postToExternalProvider('register', params)
  }

  public async resolve(params: { account: string }) {
    return this.postToExternalProvider('resolve', params)
  }
}
