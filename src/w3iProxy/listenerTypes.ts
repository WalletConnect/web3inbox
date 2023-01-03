import type { ChatClientTypes } from '@walletconnect/chat-client'

export interface EventMessage {
  jsonrpc: '2.0'
  method: string
  params: object
  id: number
}

export interface ChatFacadeEvents {
  chat_invite: ChatClientTypes.BaseEventArgs<ChatClientTypes.Invite>
  chat_message: ChatClientTypes.BaseEventArgs<ChatClientTypes.Message>
  chat_joined: ChatClientTypes.BaseEventArgs
  chat_ping: ChatClientTypes.BaseEventArgs
  chat_left: ChatClientTypes.BaseEventArgs
  chat_sent_message: ChatClientTypes.Message & { topic: string }
  external_message_observer: MessageEvent<EventMessage>
}
