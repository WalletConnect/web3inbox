import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { EventEmitter } from 'events'

import type { ExternalCommunicator } from './communicatorType'

declare global {
  interface Window {
    android?: {
      postMessage: (message: unknown) => void
    }
  }
}

export class AndroidCommunicator implements ExternalCommunicator {
  private readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter
  }

  public async postToExternalProvider<TReturn>(
    methodName: string,
    params: unknown,
    _: 'chat' | 'notify'
  ) {
    return new Promise<TReturn>(resolve => {
      const message = formatJsonRpcRequest(methodName, params)

      const messageListener = (messageResponse: JsonRpcResult<TReturn>) => {
        resolve(messageResponse.result)
      }
      this.emitter.once(message.id.toString(), messageListener)
      if (window.android) {
        window.android.postMessage(JSON.stringify(message))
      }
    })
  }
}
