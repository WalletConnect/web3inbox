import type { PushClientTypes } from '@walletconnect/push-client'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import W3iContext from '../../../contexts/W3iContext/context'
import AppNotificationItem from './AppNotificationItem'
import './AppNotifications.scss'
import AppNotificationsHeader from './AppNotificationsHeader'

const AppNotifications = () => {
  const { topic } = useParams<{ topic: string }>()
  const { activeSubscriptions, pushClientProxy } = useContext(W3iContext)
  const app = activeSubscriptions.find(mock => mock.topic === topic)
  const [notifications, setNotifications] = useState<PushClientTypes.PushMessageRecord[]>([])

  useEffect(() => {
    if (pushClientProxy && topic) {
      pushClientProxy
        .getMessageHistory({ topic })
        .then(messageHistory => setNotifications(Object.values(messageHistory)))
    }
  }, [setNotifications, pushClientProxy, topic])

  console.log({ app, activeSubscriptions, topic })

  return app?.metadata ? (
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
  ) : (
    <div>404</div>
  )
}

export default AppNotifications
