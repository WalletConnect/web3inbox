import { NotifyClientTypes } from '@walletconnect/notify-client'

export interface TopicNotificationsState {
  fullNotifications: NotifyClientTypes.NotifyMessage[]
  existingIds: Set<string>
  hasMore: boolean
}

export interface NotificationsState {
  [topic: string]: TopicNotificationsState
}

export type NotificationsActions =
  | {
      type: 'FETCH_NOTIFICATIONS'
      notifications: NotifyClientTypes.NotifyMessage[]
      topic: string
      hasMore: boolean
    }
  | {
      type: 'UNSHIFT_NEW_NOTIFICATIONS'
      notifications: NotifyClientTypes.NotifyMessage[]
      topic: string
    }

// Opted for a reducer since the state changes are complex enough to warrant
// changes to a set and an array. Having all that inside the hooks would
// cause too many updates to the hooks, causing unnecessary rerenders.
export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsActions
): NotificationsState => {
  const topicState = state[action.topic] as TopicNotificationsState | undefined
  const currentNotifications = topicState?.fullNotifications || []
  const currentExistingIds = topicState?.existingIds || new Set<string>()

  const newNotifications = action.notifications.filter(val => !currentExistingIds.has(val.id))
  const notificationIds = newNotifications.map(notification => notification.id)
  const fullNotifications = currentNotifications || []

  for (const val of notificationIds) {
    currentExistingIds.add(val)
  }

  switch (action.type) {
    case 'UNSHIFT_NEW_NOTIFICATIONS':
      const unShiftedNotifications = newNotifications.concat(fullNotifications)

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: currentExistingIds,
          fullNotifications: unShiftedNotifications,
          hasMore: topicState?.hasMore || false
        }
      }

    case 'FETCH_NOTIFICATIONS':
      const concatenatedNotification = fullNotifications.concat(newNotifications)

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: currentExistingIds,
          fullNotifications: concatenatedNotification,
          hasMore: action.hasMore
        }
      }
  }
}
