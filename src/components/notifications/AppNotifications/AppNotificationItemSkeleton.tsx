import { forwardRef } from 'react'

import cn from 'classnames'
import { LazyMotion, domMax } from 'framer-motion'

import './AppNotifications.scss'

const AppNotificationItemSkeleton = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <LazyMotion features={domMax}>
      <div className="AppNotifications__item-skeleton">
        <div className="AppNotifications__item-skeleton__image" />
        <div className="AppNotifications__item-skeleton__content" ref={ref}>
          <div className="AppNotifications__item-skeleton__header">
            <div className="AppNotifications__item-skeleton__header__title" />
            <div className="AppNotifications__item-skeleton__header__date" />
          </div>
          <div className={cn('AppNotifications__item-skeleton__message')} />
        </div>
      </div>
    </LazyMotion>
  )
})

export default AppNotificationItemSkeleton
