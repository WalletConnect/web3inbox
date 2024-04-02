import { forwardRef, useEffect, useRef, useState } from 'react'

import cn from 'classnames'
import { LazyMotion, domMax } from 'framer-motion'
import { Link } from 'react-router-dom'

import ArrowRightTopIcon from '@/components/general/Icon/ArrowRightTopIcon'
import CircleIcon from '@/components/general/Icon/CircleIcon'
import Text from '@/components/general/Text'
import { useFormattedTime, useIsMobile } from '@/utils/hooks'

import './AppNotifications.scss'

export interface IAppNotification {
  id: string
  image?: string
  title: string
  message: string
  isRead: boolean
  timestamp: number
  url: string | null
}
interface IAppNotificationProps {
  notification: IAppNotification
  onClear: () => void
  appLogo: string
}

const AppNotificationItemLink: React.FC<{
  children: React.ReactNode
  url: string | null
  className?: string
}> = ({ children, url, ...props }) => {
  if (!url) return <div {...props}>{children}</div>

  return (
    <Link to={url} target="_blank" {...props}>
      {children}
    </Link>
  )
}

const AppNotificationItem = forwardRef<HTMLDivElement, IAppNotificationProps>(
  ({ notification, appLogo }, ref) => {
    const isMobile = useIsMobile()

    const maxBodyLength = isMobile? 120 : 180;

    const formattedTime = useFormattedTime(notification.timestamp)
    const [textClamped, setTextClamped] = useState<boolean>(
      notification.message.length > maxBodyLength
    )
    const [showMore, setShowMore] = useState<boolean>(false)

    const notificationBodyRef = useRef<HTMLDivElement>(null);

    const handleToggleDescription = (e: React.MouseEvent) => {
      e.preventDefault()
      setShowMore(prevState => !prevState)
    }

    useEffect(() => {
      setTextClamped(notification.message.length > maxBodyLength)
    }, [notification.message, maxBodyLength])

    const body =
      textClamped && !showMore
        ? notification.message.slice(0, maxBodyLength) + '...'
        : notification.message

    return (
      <LazyMotion features={domMax}>
        <AppNotificationItemLink
          url={notification.url}
          className={cn(
            'AppNotifications__item',
            notification.isRead ? '' : 'AppNotifications__item--blue',
            notification.url ? 'AppNotifications__item__link' : ''
          )}
        >
          <img
            src={notification.image || appLogo || '/fallback.svg'}
            loading="lazy"
            alt="image corresponding to the notification"
          />

          <div key={notification.id} className="AppNotifications__item__content" ref={ref}>
            <div className="AppNotifications__item__header">
              <div className="AppNotifications__item__title">
                <Text variant="paragraph-500">{notification.title}</Text>
                {notification.url ? (
                  <ArrowRightTopIcon className="AppNotifications__item__title__external-link-icon" />
                ) : null}
              </div>
              <div className="AppNotifications__item__header__wrapper">
                {formattedTime ? (
                  <Text
                    className="AppNotifications__item__header__wrapper__date"
                    variant="tiny-500"
                  >
                    {formattedTime}
                  </Text>
                ) : null}
                {notification.url ? (
                  <div className="AppNotifications__item__header__wrapper__visit-link">
                    <Text variant="link-500">Visit Link</Text>
                    <ArrowRightTopIcon />
                  </div>
                ) : null}
                <div className="AppNotifications__item__status">
                  {!notification.isRead && <CircleIcon />}
                </div>
              </div>
            </div>
            <Text
              className={cn('AppNotifications__item__message', showMore ? 'show_more' : '')}
              variant="small-400"
	      ref={notificationBodyRef}
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
        </AppNotificationItemLink>
      </LazyMotion>
    )
  }
)

export default AppNotificationItem
