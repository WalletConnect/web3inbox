import type { NotifyClient, NotifyClientTypes } from '@walletconnect/notify-client'

type NextAction<T extends 'subscribe' | 'update' | 'deleteSubscription'> = {
  type: T
  params: Parameters<NotifyClient[T]>[0]
}

type NextActions = NextAction<'subscribe'> | NextAction<'update'> | NextAction<'deleteSubscription'>

export interface NotifyFacadeEvents {
  notify_message: NotifyClientTypes.EventArguments['notify_message']
  notify_subscription: NotifyClientTypes.EventArguments['notify_subscription']
  notify_update: NotifyClientTypes.EventArguments['notify_update']
  notify_delete: NotifyClientTypes.EventArguments['notify_delete']
  notify_subscriptions_changed: NotifyClientTypes.EventArguments['notify_subscriptions_changed']
  notify_signature_requested: { message: string }
  notify_signature_request_cancelled: never
  notify_reregister: { userPubkey: string; nextAction: NextActions }
  sync_update: never
}
