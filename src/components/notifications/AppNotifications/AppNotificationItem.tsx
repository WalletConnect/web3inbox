import { useContext, useEffect, useState } from 'react'
import { useFormattedTime } from '../../../utils/hooks'
import CircleIcon from '../../general/Icon/CircleIcon'
import './AppNotifications.scss'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LazyMotion, PanInfo, domMax, m, useAnimationControls } from 'framer-motion'
import ClearIcon from '../../../assets/ClearIcon.png'
import UnreadIcon from '../../../assets/UnreadIcon.png'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AppNotificationDragContext, AppNotificationsDragContext } from './index'

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

const DRAG_OFFSET = 150

const AppNotificationItem: React.FC<IAppNotificationProps> = ({ notification, appLogo }) => {
  const [notificationsDrag, setNotificationsDrag] = useContext<AppNotificationsDragContext>(
    AppNotificationDragContext
  )
  const formattedTime = useFormattedTime(notification.timestamp)
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()

  const dragControls = useAnimationControls()
  const actionControls = useAnimationControls()

  useEffect(() => {
    // If current notification is dragged, hide dragControls for all other notifications
    const currentNotificationItem = notificationsDrag?.find(
      n => n.id.toString() === notification.id
    )
    if (!currentNotificationItem?.isDragged) {
      dragControls.start('hidden')
      actionControls.start('hidden')
    }
  }, [notificationsDrag])

  // On clicking a button, it should reset dragControls to hidden
  const handleClearClick = () => {
    // Do more stuff here
    dragControls.start('hidden')
    actionControls.start('hidden')
  }

  const handleUnreadClick = () => {
    // Do more stuff here
    dragControls.start('hidden')
    actionControls.start('hidden')
  }

  const handleDragEnd = (_: never, info: PanInfo) => {
    const shouldShowControls = info.velocity.x >= 50 || info.offset.x > DRAG_OFFSET / 2
    if (shouldShowControls) {
      dragControls.start('visible')
    } else {
      dragControls.start('hidden')
    }
  }

  const handleDrag = (_: never, info: PanInfo) => {
    const shouldShowActions = info.velocity.x >= 0 || info.offset.x > DRAG_OFFSET / 2
    if (shouldShowActions) {
      actionControls.start('visible')
    } else {
      actionControls.start('hidden')
    }
  }

  // Change current items drag state to true and all others to false
  const handleDragStart = () => {
    setNotificationsDrag(
      notificationsDrag?.map(n => {
        return {
          ...n,
          isDragged: n.id.toString() === notification.id
        }
      })
    )
  }

  return (
    <LazyMotion features={domMax}>
      <m.div
        drag="x"
        animate={dragControls}
        dragConstraints={{ left: 0, right: DRAG_OFFSET }}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        dragElastic={0.05}
        whileHover={{ scale: 1.01 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
        whileDrag={{ scale: 1.02 }}
        initial="hidden"
        variants={{
          hidden: { x: 0 },
          visible: { x: DRAG_OFFSET }
        }}
        className="AppNotifications__item"
        onMouseEnter={() => setDropdownToShow(notification.id)}
        onMouseLeave={() => setDropdownToShow(undefined)}
      >
        <m.div
          animate={actionControls}
          initial="hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="AppNotificationsActions"
        >
          <button onClick={handleClearClick} className="AppNotificationsActions__clear">
            <img src={ClearIcon} />
            <div className="AppNotificationsActions__clear--text">Clear</div>
          </button>
          <button onClick={handleUnreadClick} className="AppNotificationsActions__unread">
            <img src={UnreadIcon} />
            <div className="AppNotificationsActions__clear--text">Unread</div>
          </button>
        </m.div>
        <div className="AppNotifications__item__status">
          {!notification.isRead && <CircleIcon />}
        </div>
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
      </m.div>
    </LazyMotion>
  )
}

export default AppNotificationItem
