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
  topic: string
  hasMore: boolean
}

// Opted for a reducer since the state changes are complex enough to warrant
// changes to a set and an array. Having all that inside the hooks would
// cause too many updates to the hooks, causing unnecessary rerenders.
export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsActions
): NotificationsState => {
  const topicState = state[action.topic] as TopicNotificationsState | undefined

  switch (action.type) {
    case 'FETCH_NOTIFICATIONS':
      const ids = topicState?.existingIds || new Set<string>()
      const filteredNotifications = action.notifications.filter(val => !ids.has(val.id))
      const notificationIds = action.notifications.map(notification => notification.id)

      const fullNotifications = topicState?.fullNotifications || []
      const newFullIdsSet = new Set(topicState?.existingIds || [])

      for (const val of notificationIds) {
        newFullIdsSet.add(val)
      }

      const concatenatedNotification = fullNotifications.concat(filteredNotifications)

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: newFullIdsSet,
          fullNotifications: concatenatedNotification,
          hasMore: action.hasMore
        }
      }
  }
}
