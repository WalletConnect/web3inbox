import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'

import W3iContext from '@/contexts/W3iContext/context'
import { notificationsReducer } from '@/reducers/notifications'
import { useNotifications } from '@web3inbox/react'

const IntersectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
}

const NOTIFICATION_BATCH_SIZE = 12

export const useNotificationsInfiniteScroll = (topic?: string) => {
  const intersectionObserverRef = useRef<HTMLDivElement>(null)
  const { notifyClientProxy } = useNotifications(5, true)
  const [state, dispatch] = useReducer(notificationsReducer, {})

  const nextPageInternal = useCallback(
    async (lastMessageId?: string) => {
      if (!(notifyClientProxy && topic)) {
        return
      }

      dispatch({ type: 'FETCH_NOTIFICATIONS_LOADING', topic })

      const newNotifications = await notifyClientProxy.getNotificationHistory({
        topic,
        limit: NOTIFICATION_BATCH_SIZE,
        startingAfter: lastMessageId
      })

      dispatch({
        type: 'FETCH_NOTIFICATIONS_DONE',
        notifications: newNotifications.notifications,
        hasMore: newNotifications.hasMore,
        topic
      })
    },
    [notifyClientProxy, dispatch, topic]
  )

  const unshiftNewMessage = useCallback(async () => {
    if (!(notifyClientProxy && topic)) {
      return
    }

    const newNotifications = await notifyClientProxy.getNotificationHistory({
      topic,
      limit: 5,
      startingAfter: undefined
    })

    dispatch({
      type: 'UNSHIFT_NEW_NOTIFICATIONS',
      notifications: newNotifications.notifications.slice(0, 1),
      topic
    })
  }, [notifyClientProxy, dispatch, topic])

  const topicState = topic ? state?.[topic] : undefined
  const topicNotifications = topicState ? topicState.fullNotifications : []
  const isLoading = topicState ? topicState.isLoading : []
  const hasMore = topicState ? topicState.hasMore : false

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
    isLoading,
    notifications: topicNotifications,
    intersectionObserverRef,
    nextPage: () => nextPageInternal(lastMessageId),
    unshiftNewMessage
  }
}
