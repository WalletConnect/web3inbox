import { Fragment, createContext, useContext, useEffect, useRef, useState } from 'react'

import { useSubscription } from '@web3inbox/react'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { noop } from 'rxjs'

import Label from '@/components/general/Label'
import MobileHeader from '@/components/layout/MobileHeader'
import AppNotificationItemSkeleton from '@/components/notifications/AppNotifications/AppNotificationItemSkeleton'
import W3iContext from '@/contexts/W3iContext/context'
import { useNotificationsInfiniteScroll } from '@/utils/hooks/useNotificationsInfiniteScroll'

import AppNotificationItem from './AppNotificationItem'
import AppNotificationsCardMobile from './AppNotificationsCardMobile'
import AppNotificationsEmpty from './AppNotificationsEmpty'
import AppNotificationsHeader from './AppNotificationsHeader'

import './AppNotifications.scss'

export interface AppNotificationsDragProps {
  id: string
  isDragged: boolean
}

export type AppNotificationsDragContext = [
  AppNotificationsDragProps[] | undefined,
  React.Dispatch<React.SetStateAction<AppNotificationsDragProps[] | undefined>>
]

export const AppNotificationDragContext = createContext<AppNotificationsDragContext>([
  [],
  () => null
])

const AppNotifications = () => {
  const { userPubkey } = useContext(W3iContext)
  const { domain } = useParams<{ domain: string }>()
  const { data: app } = useSubscription(userPubkey, domain)
  const { isLoading, notifications, intersectionObserverRef, nextPage } =
    useNotificationsInfiniteScroll(userPubkey, domain)

  const ref = useRef<HTMLDivElement>(null)

  const [notificationsDrag, setNotificationsDrag] = useState<
    AppNotificationsDragProps[] | undefined
  >()

  return app?.metadata ? (
    <AppNotificationDragContext.Provider value={[notificationsDrag, setNotificationsDrag]}>
      <AnimatePresence>
        <motion.div
          ref={ref}
          className="AppNotifications PageContainer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.33 }}
        >
          <div className="AppNotifications__border"></div>
          <AppNotificationsHeader
            id={app.topic}
            name={app.metadata.name}
            logo={app.metadata?.icons?.[0]}
            domain={app.metadata.appDomain}
          />
          <MobileHeader
            back="/notifications"
            notificationId={app.topic}
            title={app.metadata.name}
          />
          <AppNotificationsCardMobile />
          {isLoading || notifications.length > 0 ? (
            <div className="AppNotifications__list">
              <div className="AppNotifications__list__content">
                {notifications.length > 0 ? <Label color="main">Latest</Label> : null}
                {notifications.map((notification, index) => (
                  <AppNotificationItem
                    ref={index === notifications.length - 1 ? intersectionObserverRef : null}
                    key={notification.id}
                    onClear={nextPage}
                    notification={{
                      timestamp: notification.sentAt,
                      // We do not manage read status for now.
                      isRead: true,
                      id: notification.id.toString(),
                      message: notification.body,
                      title: notification.title,
                      image: notification.type
                        ? app?.scope[notification.type]?.imageUrls?.md
                        : undefined,
                      url: notification.url
                    }}
                    appLogo={app.metadata?.icons?.[0]}
                  />
                ))}
                {isLoading ? (
                  <Fragment>
                    <AppNotificationItemSkeleton />
                    <AppNotificationItemSkeleton />
                    <AppNotificationItemSkeleton />
                  </Fragment>
                ) : null}
              </div>
            </div>
          ) : (
            <AppNotificationsEmpty icon={app.metadata?.icons?.[0]} name={app.metadata.name} />
          )}
        </motion.div>
      </AnimatePresence>
    </AppNotificationDragContext.Provider>
  ) : null
}

export default AppNotifications
