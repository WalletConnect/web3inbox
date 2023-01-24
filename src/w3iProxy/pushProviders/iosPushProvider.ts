import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import type { PushClientFunctions } from './types'
import ExternalPushProvider from './externalPushProvider'

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

export default class iOSPushProvider extends ExternalPushProvider {
  public providerName = 'iOSPushProvider'
  protected async postToExternalProvider<MName extends keyof PushClientFunctions>(
    methodName: MName,
    ...params: Parameters<PushClientFunctions[MName]>
  ) {
    return new Promise<ReturnType<PushClientFunctions[MName]>>(resolve => {
      const message = formatJsonRpcRequest(methodName, params)

      const messageListener = (messageResponse: JsonRpcResult) => {
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
