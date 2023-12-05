import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { noop } from 'rxjs'

import Label from '@/components/general/Label'
import MobileHeader from '@/components/layout/MobileHeader'
import W3iContext from '@/contexts/W3iContext/context'

import AppNotificationItem from './AppNotificationItem'
import AppNotificationsCardMobile from './AppNotificationsCardMobile'
import AppNotificationsEmpty from './AppNotificationsEmpty'
import AppNotificationsHeader from './AppNotificationsHeader'

import './AppNotifications.scss'

export interface AppNotificationsDragProps {
  id: number
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
  const [notifications, setNotifications] = useState<NotifyClientTypes.NotifyMessageRecord[]>([])

  const ref = useRef<HTMLDivElement>(null)

  const [notificationsDrag, setNotificationsDrag] = useState<
    AppNotificationsDragProps[] | undefined
  >()

  const updateMessages = useCallback(() => {
    if (notifyClientProxy && topic) {
      notifyClientProxy.getMessageHistory({ topic }).then(messageHistory => {
        setNotifications(Object.values(messageHistory))
        setNotificationsDrag(
          Object.values(messageHistory).map(notification => {
            return {
              id: notification.id,
              isDragged: false
            }
          })
        )
      })
    }
  }, [setNotifications, notifyClientProxy, topic])

  useEffect(() => {
    updateMessages()
  }, [updateMessages])

  useEffect(() => {
    if (!(notifyClientProxy && topic)) {
      return noop
    }

    const notifyMessageSentSub = notifyClientProxy.observe('notify_message', {
      next: updateMessages
    })

    return () => {
      notifyMessageSentSub.unsubscribe()
    }
  }, [notifyClientProxy, setNotifications, topic])

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
            <>
              <div className="AppNotifications__list">
                <Label color="main">Latest</Label>
                <>
                  {notifications
                    .sort((a, b) => b.publishedAt - a.publishedAt)
                    .map(notification => (
                      <AppNotificationItem
                        key={notification.id}
                        onClear={updateMessages}
                        notification={{
                          timestamp: notification.publishedAt,
                          // We do not manage read status for now.
                          isRead: true,
                          id: notification.id.toString(),
                          message: notification.message.body,
                          title: notification.message.title,
                          image: notification.message.icon,
                          url: notification.message.url
                        }}
                        appLogo={app.metadata?.icons?.[0]}
                      />
                    ))}
                </>
              </div>
            </>
          ) : (
            <AppNotificationsEmpty icon={app.metadata?.icons?.[0]} name={app.metadata.name} />
          )}
        </motion.div>
      </AnimatePresence>
    </AppNotificationDragContext.Provider>
  ) : null
}

export default AppNotifications
