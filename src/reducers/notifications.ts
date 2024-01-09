import { NotifyClientTypes } from '@walletconnect/notify-client'

export interface TopicNotificationsState {
  fullNotifications: NotifyClientTypes.NotifyMessage[]
  existingIds: Set<string>
  hasMore: boolean
}

export interface NotificationsState {
  [topic: string]: TopicNotificationsState
}

export type NotificationsActions = {
  type: 'FETCH_NOTIFICATIONS'
  notifications: NotifyClientTypes.NotifyMessage[]
  uniqueIds: string[]
  topic: string
  hasMore: boolean
}

export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsActions
): NotificationsState => {
  const topicState = state[action.topic] as TopicNotificationsState | undefined

  switch (action.type) {
    case 'FETCH_NOTIFICATIONS':
      const ids = topicState?.existingIds || new Set<string>()
      const filteredVals = action.notifications.filter(val => !ids.has(val.id))
      const fullNotifications = topicState?.fullNotifications || []

      const newFullIdsSet = new Set(topicState?.existingIds || [])

      for (const val of action.uniqueIds) {
        newFullIdsSet.add(val)
      }

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: newFullIdsSet,
          fullNotifications: fullNotifications.concat(filteredVals),
          hasMore: action.hasMore
        }
      }
  }
}
