import { useEffect, useState } from 'react'

import cn from 'classnames'
import { LazyMotion, domMax } from 'framer-motion'

import CircleIcon from '@/components/general/Icon/CircleIcon'
import Text from '@/components/general/Text'
import { useFormattedTime } from '@/utils/hooks'

import './AppNotifications.scss'

const MAX_BODY_LENGTH = 180

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
  const [textClamped, setTextClamped] = useState<boolean>(
    notification.message.length > MAX_BODY_LENGTH
  )
  const [showMore, setShowMore] = useState<boolean>(false)

  useEffect(() => {
    setTextClamped(notification.message.length > MAX_BODY_LENGTH)
  }, [notification.message])

  const handleToggleDescription = () => {
    setShowMore(prevState => !prevState)
  }

  const body =
    textClamped && !showMore
      ? notification.message.slice(0, MAX_BODY_LENGTH) + '...'
      : notification.message

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
            className={cn('AppNotifications__item__message', showMore ? 'show_more' : '')}
            variant="small-400"
          >
            {body}
          </Text>
          {textClamped && (
            <button
              onClick={handleToggleDescription}
              className="AppNotifications__item__show_button"
            >
              <Text variant="small-400">{showMore ? 'Show less' : 'Show more'}</Text>
            </button>
          )}
        </div>
      </div>
    </LazyMotion>
  )
}

export default AppNotificationItem
