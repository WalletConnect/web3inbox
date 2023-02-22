import ExternalPushProvider from './externalPushProvider'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import type { PushClientFunctions } from './types'

declare global {
  interface Window {
    android?: {
      postMessage: (message: unknown) => void
    }
  }
}

export default class AndroidPushProvider extends ExternalPushProvider {
  public providerName = 'AndroidPushProvider'
  protected async postToExternalProvider<MName extends keyof PushClientFunctions>(
    methodName: MName,
    ...params: Parameters<PushClientFunctions[MName]>
  ) {
    return new Promise<ReturnType<PushClientFunctions[MName]>>(resolve => {
      const message = formatJsonRpcRequest(methodName, params[0])

      const messageListener = (messageResponse: JsonRpcResult) => {
        resolve(messageResponse.result)
      }
      this.emitter.once(message.id.toString(), messageListener)
      if (window.android) {
        window.android.postMessage(message)
      }
    })
  }
}
