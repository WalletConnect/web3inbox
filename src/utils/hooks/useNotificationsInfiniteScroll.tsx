import { useEffect, useRef } from 'react'

import { useNotifications } from '@web3inbox/react'

const IntersectionObserverOptions = {
  root: null,
  threshold: 0.5
}

const NOTIFICATION_BATCH_SIZE = 12

export const useNotificationsInfiniteScroll = (account?: string, domain?: string) => {
  const {
    data: notifications,
    fetchNextPage,
    hasMore,
    hasMoreUnread,
    isLoadingNextPage
  } = useNotifications(NOTIFICATION_BATCH_SIZE, true, account, domain)

  const intersectionObserverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const target = entries[0]
      if (target.isIntersecting && (hasMore || hasMoreUnread)) {
        fetchNextPage()
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
  }, [intersectionObserverRef, fetchNextPage, hasMore, hasMoreUnread])

  return {
    hasMore,
    isLoading: isLoadingNextPage,
    notifications: notifications,
    intersectionObserverRef,
    nextPage: () => fetchNextPage()
  }
}
