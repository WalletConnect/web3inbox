import type { ChatClientTypes } from '@walletconnect/chat-client'

export interface ChatFacadeEvents {
  chat_invite: ChatClientTypes.BaseEventArgs<ChatClientTypes.Invite>
  chat_message: ChatClientTypes.BaseEventArgs<ChatClientTypes.Message>
  chat_joined: ChatClientTypes.BaseEventArgs
  chat_ping: ChatClientTypes.BaseEventArgs
  chat_left: ChatClientTypes.BaseEventArgs
  chat_sent_message: null
}

type ChatFacadeEventsObservables = ChatFacadeEvents
