import ExternalChatProvider from './externalChatProvider'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import type { ChatClientFunctions } from './types'

export default class AndroidChatProvider extends ExternalChatProvider {
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
}
