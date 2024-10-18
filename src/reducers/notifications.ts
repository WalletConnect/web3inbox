import { NotifyClientTypes } from '@walletconnect/notify-client'

// Notification state for each topic
export interface TopicNotificationsState {
  fullNotifications: NotifyClientTypes.NotifyNotification[]
  existingIds: Set<string>
  hasMore: boolean
  isLoading: boolean
}

export interface NotificationsState {
  [topic: string]: TopicNotificationsState
}

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

// Updates the topic state, filters notifications
function getUpdatedTopicState(
  topicState: TopicNotificationsState | undefined,
  notifications: NotifyClientTypes.NotifyNotification[]
) {
  const existingIds = topicState?.existingIds || new Set<string>() // Set of IDs for already existing notifications
  const filteredNotifications = notifications.filter(notification => !existingIds.has(notification.id)) // Filters out new notifications

  const fullNotifications = topicState?.fullNotifications || []
  const updatedIds = new Set(existingIds)

  notifications.forEach(notification => updatedIds.add(notification.id))

  return {
    filteredNotifications,
    fullNotifications,
    updatedIds
  }
}

// Reducer for handling notification actions
export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsActions
): NotificationsState => {
  const topicState = state[action.topic]

  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_LOADING': {
      // Sets loading flag for the topic
      return topicState
        ? {
            ...state,
            [action.topic]: {
              ...topicState,
              isLoading: true
            }
          }
        : state
    }

    case 'UNSHIFT_NEW_NOTIFICATIONS': {
      // Adds new notifications to the beginning of the list
      const { filteredNotifications, fullNotifications, updatedIds } = getUpdatedTopicState(
        topicState,
        action.notifications
      )
      const unshiftedNotifications = [...filteredNotifications, ...fullNotifications]

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: updatedIds,
          fullNotifications: unshiftedNotifications,
          hasMore: topicState?.hasMore || false,
          isLoading: false
        }
      }
    }

    case 'FETCH_NOTIFICATIONS_DONE': {
      // Completes the loading of notifications
      const { filteredNotifications, fullNotifications, updatedIds } = getUpdatedTopicState(
        topicState,
        action.notifications
      )
      const concatenatedNotifications = [...fullNotifications, ...filteredNotifications]

      return {
        ...state,
        [action.topic]: {
          ...topicState,
          existingIds: updatedIds,
          fullNotifications: concatenatedNotifications,
          hasMore: action.hasMore,
          isLoading: false
        }
      }
    }

    default:
      return state
  }
}
