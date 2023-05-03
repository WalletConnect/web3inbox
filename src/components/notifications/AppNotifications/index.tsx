import type { PushClientTypes } from '@walletconnect/push-client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { noop } from 'rxjs'
import W3iContext from '../../../contexts/W3iContext/context'
import AppNotificationItem from './AppNotificationItem'
import './AppNotifications.scss'
import AppNotificationsHeader from './AppNotificationsHeader'

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
  const { activeSubscriptions, pushClientProxy } = useContext(W3iContext)
  const app = activeSubscriptions.find(mock => mock.topic === topic)
  const [notifications, setNotifications] = useState<PushClientTypes.PushMessageRecord[]>([])
  const [notificationsDrag, setNotificationsDrag] = useState<
    AppNotificationsDragProps[] | undefined
  >()

  useEffect(() => {
    if (pushClientProxy && topic) {
      pushClientProxy.getMessageHistory({ topic }).then(messageHistory => {
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
  }, [setNotifications, pushClientProxy, topic])

  useEffect(() => {
    if (!(pushClientProxy && topic)) {
      return noop
    }

    const pushMessageSentSub = pushClientProxy.observe('push_message', {
      next: () => {
        pushClientProxy
          .getMessageHistory({ topic })
          .then(messageHistory => setNotifications(Object.values(messageHistory)))
      }
    })

    return () => {
      pushMessageSentSub.unsubscribe()
    }
  }, [pushClientProxy, setNotifications, topic])

  return app?.metadata ? (
    <AppNotificationDragContext.Provider value={[notificationsDrag, setNotificationsDrag]}>
      <div className="AppNotifications">
        <AppNotificationsHeader
          id={app.topic}
          name={app.metadata.name}
          logo={app.metadata.icons[0]}
        />
        <div className="AppNotifications__list">
          {notifications.map(notification => (
            <AppNotificationItem
              key={notification.id}
              notification={{
                timestamp: Date.now(),
                isRead: false,
                id: notification.id.toString(),
                message: notification.message.body,
                title: notification.message.title,
                image: notification.message.icon
              }}
              appLogo={app.metadata.icons[0]}
            />
          ))}
        </div>
      </div>
    </AppNotificationDragContext.Provider>
  ) : (
    <div>404</div>
  )
}

export default AppNotifications
