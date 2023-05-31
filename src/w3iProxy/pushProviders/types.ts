import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { WalletClient as PushWalletClient, PushClientTypes } from '@walletconnect/push-client'
import type { NextObserver, Observable } from 'rxjs'
import type { PushFacadeEvents } from '../listenerTypes'

// Omitting non-method PushWalletClient keys
type NonMethodPushClientKeys =
  | 'context'
  | 'core'
  | 'decryptMessage'
  | 'emit'
  | 'engine'
  | 'events'
  | 'history'
  | 'identityKeys'
  | 'init'
  | 'keyserverUrl'
  | 'logger'
  | 'messages'
  | 'name'
  | 'off'
  | 'on'
  | 'once'
  | 'opts'
  | 'pairing'
  | 'protocol'
  | 'removeListener'
  | 'requests'
  | 'subscriptions'
  | 'version'

/*
 * These methods are not currently async in the PushWalletClient
 * forcing their type (and implementing them as so) makes them
 * more seamless to implement with both internal & external providers
 */
interface ModifiedPushClientFunctions {
  getActiveSubscriptions: (
    ...params: Parameters<PushWalletClient['getActiveSubscriptions']>
  ) => Promise<ReturnType<PushWalletClient['getActiveSubscriptions']>>
  getMessageHistory: (
    ...params: Parameters<PushWalletClient['getMessageHistory']>
  ) => Promise<ReturnType<PushWalletClient['getMessageHistory']>>
}

export type PushClientFunctions = Omit<PushWalletClient, NonMethodPushClientKeys>
export type W3iPush = ModifiedPushClientFunctions &
  Omit<PushClientFunctions, keyof ModifiedPushClientFunctions>

export type W3iPushProvider = W3iPush & {
  isListeningToMethodFromPostMessage: (method: string) => boolean
  handleMessage: (request: JsonRpcRequest<unknown>) => void
}
