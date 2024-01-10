import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { noop } from 'rxjs'

import Label from '@/components/general/Label'
import MobileHeader from '@/components/layout/MobileHeader'
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
  const { topic } = useParams<{ topic: string }>()
  const { activeSubscriptions, notifyClientProxy } = useContext(W3iContext)
  const app = activeSubscriptions.find(mock => mock.topic === topic)
  const { notifications, intersectionObserverRef, nextPage, unshiftNewMessage } = useNotificationsInfiniteScroll(topic)

  const ref = useRef<HTMLDivElement>(null)

  const [notificationsDrag, setNotificationsDrag] = useState<
    AppNotificationsDragProps[] | undefined
  >()

  useEffect(() => {
    if (!(notifyClientProxy && topic)) {
      return noop
    }

    const notifyMessageSentSub = notifyClientProxy.observe('notify_message', {
      next: () => {
	console.log(">> calling unshift")
        unshiftNewMessage()
      }
    })

    return () => {
      notifyMessageSentSub.unsubscribe()
    }
  }, [notifyClientProxy, nextPage, topic])

  return app?.metadata ? (
    <AppNotificationDragContext.Provider value={[notificationsDrag, setNotificationsDrag]}>
      <AnimatePresence>
        <motion.div
          ref={ref}
          className="AppNotifications"
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
          {notifications.length > 0 ? (
            <div className="AppNotifications__list">
              <div className="AppNotifications__list__content">
                <Label color="main">Latest</Label>
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
