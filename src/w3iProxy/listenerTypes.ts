import type { PushClientTypes } from '@walletconnect/push-client'
import type { ChatClientTypes } from '@walletconnect/chat-client'

export interface ChatFacadeEvents {
  chat_invite: ChatClientTypes.BaseEventArgs<ChatClientTypes.Invite>
  chat_message: ChatClientTypes.BaseEventArgs<ChatClientTypes.Message>
  chat_joined: ChatClientTypes.BaseEventArgs
  chat_ping: ChatClientTypes.BaseEventArgs
  chat_left: ChatClientTypes.BaseEventArgs
  chat_invite_accepted: ChatClientTypes.BaseEventArgs<{
    invite: ChatClientTypes.SentInvite
    topic: string
  }>
  chat_invite_rejected: ChatClientTypes.BaseEventArgs<{ invite: ChatClientTypes.SentInvite }>
  chat_invite_sent: never
  chat_message_sent: never
  chat_account_change: { account: string }
}

export interface PushFacadeEvents {
  push_request: PushClientTypes.EventArguments['push_request']
  push_message: PushClientTypes.EventArguments['push_message']
}
