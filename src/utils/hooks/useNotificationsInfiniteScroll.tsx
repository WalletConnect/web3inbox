import { useEffect, useRef } from 'react'

import { useNotifications } from '@web3inbox/react'

const IntersectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
}

const NOTIFICATION_BATCH_SIZE = 6

export const useNotificationsInfiniteScroll = (account?: string, domain?: string) => {
  const {
    data: notifications,
    fetchNextPage,
    hasMore,
    isLoadingNextPage
  } = useNotifications(NOTIFICATION_BATCH_SIZE, true, account, domain)

  const intersectionObserverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const target = entries[0]
      if (target.isIntersecting && hasMore) {
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
  }, [intersectionObserverRef, hasMore])


  return {
    hasMore,
    isLoading: isLoadingNextPage,
    notifications: notifications,
    intersectionObserverRef,
    nextPage: () => fetchNextPage()
  }
}
