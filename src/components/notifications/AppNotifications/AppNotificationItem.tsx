import { forwardRef, useEffect, useRef, useState } from 'react'

import cn from 'classnames'
import { LazyMotion, domMax } from 'framer-motion'
import { Link } from 'react-router-dom'

import ArrowRightTopIcon from '@/components/general/Icon/ArrowRightTopIcon'
import CircleIcon from '@/components/general/Icon/CircleIcon'
import Text from '@/components/general/Text'
import { useFormattedTime } from '@/utils/hooks'

import './AppNotifications.scss'

export interface IAppNotification {
  id: string
  image?: string
  title: string
  message: string
  isRead: boolean
  read: () => void
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
  onMouseOver?: () => void
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
    const formattedTime = useFormattedTime(notification.timestamp)

    const [showMore, setShowMore] = useState(false)

    const notificationBodyRef = useRef<HTMLDivElement>(null)

    const body = notification.message

    const [isClamped, setIsClamped] = useState(false)

    useEffect(() => {
      if (!notificationBodyRef.current) return

      // Need to use resize observer in the case of browsers resizing the window.
      const resizeObserver = new ResizeObserver(() => {
	// If it's expanded then we don't need to check for clamping.
        if (!showMore) {
          setIsClamped(
            notificationBodyRef.current
	      // Depend on dom as single source of truth for clamping.
              ? notificationBodyRef.current.scrollHeight > notificationBodyRef.current.clientHeight
              : false
          )
        }
      })

      resizeObserver.observe(notificationBodyRef.current)

      return () => {
        if (!notificationBodyRef.current) return
        resizeObserver.unobserve(notificationBodyRef.current)
      }
    })

    const handleToggleReadMore = (e: React.MouseEvent) => {
      e.preventDefault()
      setShowMore(currentShowMore => !currentShowMore)
    }

    return (
      <LazyMotion features={domMax}>
        <AppNotificationItemLink
          url={notification.url}
          onMouseOver={notification.read}
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
              className={cn('AppNotifications__item__message', showMore && 'show_more')}
              ref={notificationBodyRef}
              variant="small-400"
            >
              {body}
            </Text>
            {isClamped && (
              <button
                onClick={handleToggleReadMore}
                className="AppNotifications__item__show_button"
              >
                <Text variant="small-400">{showMore ? 'Show less' : 'Show more'}</Text>
              </button>
            )}{' '}
          </div>
        </AppNotificationItemLink>
      </LazyMotion>
    )
  }
)

export default AppNotificationItem
