import { useCallback, useContext, useEffect, useReducer, useRef } from 'react'

import W3iContext from '@/contexts/W3iContext/context'
import { notificationsReducer } from '@/reducers/notifications'

const IntersectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
}

export const useNotificationsInfiniteScroll = (topic?: string) => {
  const intersectionObserverRef = useRef<HTMLDivElement>(null)
  const { notifyClientProxy } = useContext(W3iContext)
  const [state, dispatch] = useReducer(notificationsReducer, {})

  const limit = 6

  const nextPageInternal = useCallback(
    async (lastMessageId?: string) => {
      if (!(notifyClientProxy && topic)) {
        return
      }

      const newNotifications = await notifyClientProxy.getNotificationHistory({
        topic,
        limit,
        startingAfter: lastMessageId
      })

      dispatch({
        type: 'FETCH_NOTIFICATIONS',
        notifications: newNotifications.notifications,
        uniqueIds: newNotifications.notifications.map(notification => notification.id),
        hasMore: newNotifications.hasMore,
        topic
      })
    },
    [notifyClientProxy, dispatch, topic]
  )

  const topicNotifications =
    topic && state?.[topic]?.fullNotifications ? state[topic].fullNotifications : []
  const hasMore = topic && state?.[topic]?.hasMore ? state[topic].hasMore : false

  const lastMessageId = topicNotifications.length
    ? topicNotifications[topicNotifications.length - 1].id
    : undefined

  useEffect(() => {
    nextPageInternal()
  }, [nextPageInternal])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const target = entries[0]
      if (target.isIntersecting && hasMore) {
        nextPageInternal(lastMessageId)
      }
    }, IntersectionObserverOptions)

    if (intersectionObserverRef.current) {
      observer.observe(intersectionObserverRef.current)
    }

    return () => {
      if (intersectionObserverRef.current) {
        observer.unobserve(intersectionObserverRef.current)
      }
    }
  }, [intersectionObserverRef, hasMore, lastMessageId])

  return {
    hasMore,
    notifications: topicNotifications,
    intersectionObserverRef,
    nextPage: () => nextPageInternal(lastMessageId)
  }
}
