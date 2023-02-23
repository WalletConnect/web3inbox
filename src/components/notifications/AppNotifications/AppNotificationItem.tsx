import { useState } from 'react'
import { useFormattedTime, useIsMobile } from '../../../utils/hooks'
import CircleIcon from '../../general/Icon/CircleIcon'
import './AppNotifications.scss'

export interface IAppNotification {
  id: string
  image?: string
  title: string
  message: string
  isRead: boolean
  timestamp: number
}
interface IAppNotificationProps {
  notification: IAppNotification
  appLogo: string
}

const AppNotificationItem: React.FC<IAppNotificationProps> = ({ notification, appLogo }) => {
  const formattedTime = useFormattedTime(notification.timestamp)
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()

  return (
    <div
      className="AppNotifications__item"
      onMouseEnter={() => setDropdownToShow(notification.id)}
      onMouseLeave={() => setDropdownToShow(undefined)}
    >
      <div className="AppNotifications__item__status">{!notification.isRead && <CircleIcon />}</div>

      <img
        src={notification.image ?? appLogo}
        loading="lazy"
        alt="image corresponding to the notification"
      />

      <div key={notification.id} className="AppNotifications__item__content">
        <div className="AppNotifications__item__header">
          <h4 className="AppNotifications__item__title">{notification.title}</h4>
          {formattedTime && dropdownToShow !== notification.id ? (
            <span className="AppNotifications__item__time">{formattedTime}</span>
          ) : null}
        </div>
        <span className="AppNotifications__item__message">{notification.message}</span>
      </div>
    </div>
  )
}

export default AppNotificationItem
