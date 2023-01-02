import type ChatClient from '@walletconnect/chat-client'

// Omitting chat client management keys
type OmittedChatKeys =
  | 'chatInvites'
  | 'chatKeys'
  | 'chatThreads'
  | 'chatThreadsPending'
  | 'core'
  | 'emit'
  | 'engine'
  | 'events'
  | 'getMessages'
  | 'history'
  | 'init'
  | 'logger'
  | 'name'
  | 'off'
  | 'on'
  | 'once'
  | 'removeListener'

interface ModifiedChatClientFunctions {
  getMessages: (
    ...params: Parameters<ChatClient['getMessages']>
  ) => Promise<ReturnType<ChatClient['getMessages']>>
}

export type W3iChat = ModifiedChatClientFunctions & Omit<ChatClient, OmittedChatKeys>
