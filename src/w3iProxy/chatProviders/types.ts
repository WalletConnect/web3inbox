import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'

// Omitting chat client management keys
type NonFunctionChatClientKeys =
  | 'chatContacts'
  | 'chatKeys'
  | 'chatMessages'
  | 'chatReceivedInvites'
  | 'chatReceivedInvitesStatus'
  | 'chatSentInvites'
  | 'chatThreads'
  | 'chatThreadsPending'
  | 'core'
  | 'emit'
  | 'engine'
  | 'events'
  | 'history'
  | 'historyClient'
  | 'identityKeys'
  | 'init'
  | 'initSyncStores'
  | 'keyserverUrl'
  | 'logger'
  | 'name'
  | 'off'
  | 'on'
  | 'once'
  | 'opts'
  | 'projectId'
  | 'removeListener'
  | 'syncClient'

/*
 * These methods are not currently async in the chat client
 * forcing their type (and implementing them as so) makes them
 * more seamless to implement with both internal & external providers
 */

// eslint-disable-next-line
export type W3iChat = any

export type W3iChatProvider = W3iChat & {
  isListeningToMethodFromPostMessage: (method: string) => boolean
  handleMessage: (request: JsonRpcRequest<unknown>) => void
}

export declare namespace ChatClientTypes {
  // ---------- Data Types ----------------------------------------------- //

  interface Invite {
    message: string
    inviterAccount: string
    inviteeAccount: string
    inviteePublicKey: string
  }

  interface SentInvite {
    id: number
    message: string
    inviterAccount: string
    inviteeAccount: string
    timestamp: number
    responseTopic: string
    status: string
    inviterPubKeyY: string
    inviterPrivKeyY: string
    symKey: string
  }

  interface ReceivedInvite {
    id: number
    status: string
    inviterAccount: string
    inviterPublicKey: string
    message: string
  }

  type ReceivedInviteStatus = string

  interface Media {
    type: string
    data: string
  }

  interface Message {
    topic: string
    message: string
    authorAccount: string
    timestamp: number
    media?: Media
  }

  interface Thread {
    topic: string
    selfAccount: string
    peerAccount: string
    symKey: string
  }

  interface Contact {
    accountId: string
    publicKey: string
    displayName: string
  }

  interface ChatKey {
    _key: string
    account: string
    publicKey: string
  }

  // ---------- Event Types ----------------------------------------------- //

  type Event =
    | 'chat_invite_accepted'
    | 'chat_invite_rejected'
    | 'chat_invite'
    | 'chat_left'
    | 'chat_message'
    | 'chat_ping'
    | 'sync_stores_initialized'

  interface BaseEventArgs<T = unknown> {
    id: number
    topic: string
    params: T
  }

  interface EventArguments {
    chat_invite: BaseEventArgs<Invite>
    chat_message: BaseEventArgs<Message>
    chat_ping: Omit<BaseEventArgs, 'params'>
    chat_left: Omit<BaseEventArgs, 'params'>
    chat_invite_accepted: { invite: SentInvite; topic: string; id: number }
    chat_invite_rejected: { invite: SentInvite; id: number; topic: string }
    sync_stores_initialized: Record<string, never>
  }
}
