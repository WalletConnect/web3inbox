import { useFormattedTime } from '../../../utils/hooks'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import CircleIcon from '../../general/Icon/CircleIcon'
import { LazyMotion, domMax } from 'framer-motion'
import Text from '../../general/Text'
import './AppNotifications.scss'

export interface IAppNotification {
  id: string
  image?: string
  title: string
  message: string
  isRead: boolean
  timestamp: number
  url?: string
}
interface IAppNotificationProps {
  notification: IAppNotification
  onClear: () => void
  appLogo: string
}

const AppNotificationItem: React.FC<IAppNotificationProps> = ({ notification, appLogo }) => {
  const formattedTime = useFormattedTime(notification.timestamp)
  const [textClamped, setTextClamped] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)

  const messageRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (messageRef.current) {
      setTextClamped(messageRef.current.scrollHeight > messageRef.current.clientHeight)
    }
  }, [])

  const handleToggleDescription = () => {
    setShow(prevState => !prevState)
  }

  return (
    <LazyMotion features={domMax}>
      <div
        className={cn(
          'AppNotifications__item',
          notification.isRead ? '' : 'AppNotifications__item--blue'
        )}
      >
        <img
          src={notification.image || appLogo || '/fallback.svg'}
          loading="lazy"
          alt="image corresponding to the notification"
        />

        <div key={notification.id} className="AppNotifications__item__content">
          <div className="AppNotifications__item__header">
            <div className="AppNotifications__item__title">
              <Text variant="paragraph-500"> {notification.title}</Text>
            </div>
            <div className="AppNotifications__item__header__wrapper">
              {formattedTime ? <Text variant="tiny-500">{formattedTime}</Text> : null}
              <div className="AppNotifications__item__status">
                {!notification.isRead && <CircleIcon />}
              </div>
            </div>
          </div>
          <Text
            ref={messageRef}
            className={cn('AppNotifications__item__message', show ? 'show_more' : '')}
            variant="small-400"
          >
            {notification.message}
          </Text>
          {textClamped && (
            <button
              onClick={handleToggleDescription}
              className="AppNotifications__item__show_button"
            >
              <Text variant="small-400">{show ? 'Show less' : 'Show more'}</Text>
            </button>
          )}
        </div>
      </div>
    </LazyMotion>
  )
}

export default AppNotificationItem
