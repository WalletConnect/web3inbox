import ExternalChatProvider from './externalChatProvider'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import type { ChatClientFunctions } from './types'

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

export default class iOSChatProvider extends ExternalChatProvider {
  public providerName = 'iOSChatProvider'
  protected async postToExternalProvider<MName extends keyof ChatClientFunctions>(
    methodName: MName,
    ...params: Parameters<ChatClientFunctions[MName]>
  ) {
    return new Promise<ReturnType<ChatClientFunctions[MName]>>(resolve => {
      const message = formatJsonRpcRequest(methodName, params[0])

      const messageListener = (
        messageResponse: JsonRpcResult<ReturnType<ChatClientFunctions[MName]>>
      ) => {
        resolve(messageResponse.result)
      }
      this.emitter.once(message.id.toString(), messageListener)
      if (window.webkit?.messageHandlers?.web3inbox) {
        console.log('Web3Inbox interface: ', window.webkit.messageHandlers.web3inbox)
        window.webkit.messageHandlers.web3inbox.postMessage({
          ...message
        })
      }
    })
  }
}
