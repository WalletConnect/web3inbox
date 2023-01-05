import type ChatClient from '@walletconnect/chat-client'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NextObserver, Observable } from 'rxjs'
import type { ChatFacadeEvents } from '../listenerTypes'

// Omitting chat client management keys
type NonFunctionChatClientKeys =
  | 'chatInvites'
  | 'chatKeys'
  | 'chatMessages'
  | 'chatThreads'
  | 'chatThreadsPending'
  | 'core'
  | 'emit'
  | 'engine'
  | 'events'
  | 'history'
  | 'init'
  | 'logger'
  | 'name'
  | 'off'
  | 'on'
  | 'once'
  | 'opts'
  | 'removeListener'

interface ModifiedChatClientFunctions {
  getMessages: (
    ...params: Parameters<ChatClient['getMessages']>
  ) => Promise<ReturnType<ChatClient['getMessages']>>
  getInvites: (
    ...params: Parameters<ChatClient['getInvites']>
  ) => Promise<ReturnType<ChatClient['getInvites']>>
  getThreads: (
    ...params: Parameters<ChatClient['getThreads']>
  ) => Promise<ReturnType<ChatClient['getThreads']>>
}

export type ObservableMap = Map<
  keyof ChatFacadeEvents,
  Observable<ChatFacadeEvents[keyof ChatFacadeEvents]>
>

export type ChatEventObserver<K extends keyof ChatFacadeEvents> = NextObserver<ChatFacadeEvents[K]>
export type ChatEventObservable<K extends keyof ChatFacadeEvents> = Observable<ChatFacadeEvents[K]>

export type ChatClientFunctions = Omit<ChatClient, NonFunctionChatClientKeys>
export type W3iChat = ModifiedChatClientFunctions &
  Omit<ChatClientFunctions, keyof ModifiedChatClientFunctions>

export type W3iChatProvider = W3iChat & {
  isListeningToMethodFromPost: (method: string) => boolean
  handleMessage: (request: JsonRpcRequest<unknown>) => void
}
