import type { NotifyClientTypes } from '@walletconnect/notify-client'

export interface TopicNotificationsState {
  fullNotifications: NotifyClientTypes.NotifyNotification[]
  existingIds: Set<string>
  hasMore: boolean
  isLoading: boolean
}

export type NotificationsState = Record<string, TopicNotificationsState>

export type NotificationsActions =
  | {
      type: 'FETCH_NOTIFICATIONS_DONE'
      notifications: NotifyClientTypes.NotifyNotification[]
      topic: string
      hasMore: boolean
    }
  | {
      type: 'FETCH_NOTIFICATIONS_LOADING'
      topic: string
    }
  | {
      type: 'UNSHIFT_NEW_NOTIFICATIONS'
      notifications: NotifyClientTypes.NotifyNotification[]
      topic: string
    }

/*
 * Opted for a reducer since the state changes are complex enough to warrant
 * changes to a set and an array. Having all that inside the hooks would
 * cause too many updates to the hooks, causing unnecessary rerenders.
 */
export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsActions
): NotificationsState => {
  const topicState = state[action.topic] as TopicNotificationsState | undefined

  function getTopicState(notifications: NotifyClientTypes.NotifyNotification[]) {
    const ids = topicState?.existingIds ?? new Set<string>()
    const filteredNotifications = notifications.filter(val => !ids.has(val.id))
    const notificationIds = notifications.map(notification => notification.id)

    const fullNotifications = topicState?.fullNotifications ?? []
    const newFullIdsSet = new Set(topicState?.existingIds ?? [])

    for (const val of notificationIds) {
      newFullIdsSet.add(val)
    }

    return {
      filteredNotifications,
      fullNotifications,
      newFullIdsSet
    }
  }

  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_LOADING': {
      if (topicState) {
        return {
          ...state,
          [action.topic]: {
            ...topicState,
            isLoading: true
          }
        }
      }

      return state
    }
    case 'UNSHIFT_NEW_NOTIFICATIONS': {
      const { filteredNotifications, fullNotifications, newFullIdsSet } = getTopicState(
        action.notifications
      )
      const unshiftedNotifications = filteredNotifications.concat(fullNotifications)

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: newFullIdsSet,
          fullNotifications: unshiftedNotifications,
          hasMore: topicState?.hasMore ?? false,
          isLoading: false
        }
      }
    }
    case 'FETCH_NOTIFICATIONS_DONE': {
      const { filteredNotifications, fullNotifications, newFullIdsSet } = getTopicState(
        action.notifications
      )
      const concatenatedNotification = fullNotifications.concat(filteredNotifications)

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: newFullIdsSet,
          fullNotifications: concatenatedNotification,
          hasMore: action.hasMore,
          isLoading: false
        }
      }
    }
  }
}
