import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient } from '@walletconnect/notify-client'

// Omitting non-method NotifyWalletClient keys
type NonMethodNotifyClientKeys =
  | 'context'
  | 'core'
  | 'decryptMessage'
  | 'emit'
  | 'engine'
  | 'events'
  | 'history'
  | 'historyClient'
  | 'identityKeys'
  | 'init'
  | 'initHistory'
  | 'initSyncStores'
  | 'keyserverUrl'
  | 'logger'
  | 'messages'
  | 'name'
  | 'notifyServerUrl'
  | 'off'
  | 'on'
  | 'once'
  | 'opts'
  | 'pairing'
  | 'proposals'
  | 'protocol'
  | 'removeListener'
  | 'signedStatements'
  | 'watchedAccounts'
  // TODO: Refactor to new identity key spec
  | 'prepareRegistration'
  | 'registrationData'
  | 'isRegistered'
  | 'register'
  | 'requests'
  | 'subscriptions'
  | 'syncClient'
  | 'SyncStoreController'
  | 'version'

/*
 * These methods are not currently async in the NotifyClient
 * forcing their type (and implementing them as so) makes them
 * more seamless to implement with both internal & external providers
 */
interface ModifiedNotifyClientFunctions {
  getActiveSubscriptions: (
    ...params: Parameters<NotifyClient['getActiveSubscriptions']>
  ) => Promise<ReturnType<NotifyClient['getActiveSubscriptions']>>
  registerWithEcho: () => Promise<void>
  getRegisteredWithEcho: () => Promise<boolean>
  register: (params: { account: string; domain: string; isLimited?: boolean }) => Promise<string>
  unregisterOtherAccounts: (currentAccount: string) => Promise<void>
}

export type NotifyClientFunctions = Omit<NotifyClient, NonMethodNotifyClientKeys>
export type W3iNotify = ModifiedNotifyClientFunctions &
  Omit<NotifyClientFunctions, keyof ModifiedNotifyClientFunctions>

export type W3iNotifyProvider = W3iNotify & {
  isListeningToMethodFromPostMessage: (method: string) => boolean
  handleMessage: (request: JsonRpcRequest<unknown>) => void
}
