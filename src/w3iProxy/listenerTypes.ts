import type { PushClientTypes } from '@walletconnect/push-client/dist/types/types'
import type { ChatClientTypes } from '@walletconnect/chat-client'

export interface ChatFacadeEvents {
  chat_invite: ChatClientTypes.BaseEventArgs<ChatClientTypes.Invite>
  chat_message: ChatClientTypes.BaseEventArgs<ChatClientTypes.Message>
  chat_joined: ChatClientTypes.BaseEventArgs
  chat_ping: ChatClientTypes.BaseEventArgs
  chat_left: ChatClientTypes.BaseEventArgs
  chat_account_change: { account: string }
}

export interface PushFacadeEvents {
  push_request: PushClientTypes.EventArguments['push_request']
  push_message: PushClientTypes.EventArguments['push_message']
}
