import type { PushClientTypes } from '@walletconnect/push-client'
import type { ChatClientTypes } from '@walletconnect/chat-client'

export interface ChatFacadeEvents {
  chat_invite: ChatClientTypes.BaseEventArgs<ChatClientTypes.Invite>
  chat_message: ChatClientTypes.BaseEventArgs<ChatClientTypes.Message>
  chat_joined: ChatClientTypes.BaseEventArgs
  chat_ping: ChatClientTypes.BaseEventArgs
  chat_left: ChatClientTypes.BaseEventArgs
  chat_invite_accepted: {
    invite: ChatClientTypes.SentInvite
    topic: string
  }
  chat_invite_rejected: { invite: ChatClientTypes.SentInvite }
  chat_invite_sent: never
  chat_message_sent: never
  chat_message_attempt: never
  chat_signature_requested: { message: string }
  chat_account_change: { account: string }
}

export interface PushFacadeEvents {
  push_request: PushClientTypes.EventArguments['push_request']
  push_response: PushClientTypes.EventArguments['push_response']
  push_message: PushClientTypes.EventArguments['push_message']
  push_subscription: PushClientTypes.EventArguments['push_subscription']
  push_update: PushClientTypes.EventArguments['push_update']
  push_delete: PushClientTypes.EventArguments['push_delete']
}
