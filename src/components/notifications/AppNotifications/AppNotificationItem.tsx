import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useFormattedTime, useIsMobile } from '../../../utils/hooks'
import CircleIcon from '../../general/Icon/CircleIcon'
import './AppNotifications.scss'
import type { PanInfo } from 'framer-motion'
import { motion } from 'framer-motion'
import { LazyMotion, domMax, m, useAnimationControls } from 'framer-motion'
import type { AppNotificationsDragContext } from '.'
import { AppNotificationDragContext } from '.'
import ClearIcon from '../../../assets/ClearIcon.png'
import UnreadIcon from '../../../assets/UnreadIcon.png'
import W3iContext from '../../../contexts/W3iContext/context'
import ExternalLink from '../../general/ExternalLink'
import Text from '../../general/Text'

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

const DRAG_OFFSET = 150

const AppNotificationItem: React.FC<IAppNotificationProps> = ({
  notification,
  appLogo,
  onClear
}) => {
  const formattedTime = useFormattedTime(notification.timestamp)
  const { pushClientProxy } = useContext(W3iContext)
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()
  const [textClamped, setTextClamped] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [elementHeight, setElementHeight] = useState<number>(0)
  const [animating, setAnimating] = useState<boolean>(false)

  const messageRef = useRef<HTMLSpanElement | null>(null)

  const [notificationsDrag, setNotificationsDrag] = useContext<AppNotificationsDragContext>(
    AppNotificationDragContext
  )

  const dragControls = useAnimationControls()
  const actionControls = useAnimationControls()

  const isMobile = useIsMobile()

  useEffect(() => {
    if (messageRef.current) {
      setElementHeight(messageRef.current.scrollHeight)
      setTextClamped(messageRef.current.scrollHeight > messageRef.current.clientHeight)
    }
  }, [])

  useEffect(() => {
    const currentNotificationItem = notificationsDrag?.find(
      n => n.id.toString() === notification.id
    )

    if (!currentNotificationItem?.isDragged) {
      if (currentNotificationItem) {
        dragControls.start('hidden')
        actionControls.start('hidden')
      }
    }
  }, [notificationsDrag])

  const handleClearClick = useCallback(() => {
    dragControls.start('hidden')
    pushClientProxy?.deletePushMessage({ id: Number(notification.id) }).then(onClear)
    actionControls.start('hidden')
  }, [pushClientProxy, onClear])

  const handleUnreadClick = () => {
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

  const handleDragStart = () => {
    setNotificationsDrag(currentNotifications =>
      currentNotifications?.map(n => {
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
        drag={isMobile && 'x'}
        animate={dragControls}
        dragConstraints={{ left: 0, right: DRAG_OFFSET }}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        dragElastic={false}
        whileHover={{ scale: isMobile ? 1.01 : 1 }}
        whileDrag={{ scale: 1.01 }}
        initial="hidden"
        variants={{
          hidden: { x: 0 },
          visible: { x: DRAG_OFFSET }
        }}
        className={`AppNotifications__item ${
          notification.isRead ? '' : 'AppNotifications__item--blue'
        }`}
        onMouseEnter={() => setDropdownToShow(notification.id)}
        onMouseLeave={() => setDropdownToShow(undefined)}
        onClick={() => {
          if (!animating) {
            setShow(!show)
          }
        }}
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

        <img
          src={notification.image ?? appLogo}
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
          <motion.span
            ref={messageRef}
            transition={{ duration: 0.33, ease: 'easeInOut' }}
            initial={{ maxHeight: 44 }}
            animate={{ maxHeight: show ? elementHeight : 44 }}
            onAnimationStart={() => {
              setAnimating(true)
              if (show) {
                if (messageRef.current) {
                  messageRef.current.style.webkitLineClamp = 'unset'
                }
              }
            }}
            onAnimationComplete={() => {
              setAnimating(false)
              if (!show) {
                if (messageRef.current) {
                  messageRef.current.style.webkitLineClamp = '2'
                }
              }
            }}
            className="AppNotifications__item__message"
          >
            <Text variant="small-500">{notification.message}</Text>
          </motion.span>
          {textClamped && (
            <p className="AppNotifications__item__show">{show ? 'Show less' : 'Show more'}</p>
          )}
          {notification.url && <ExternalLink link={notification.url}>Visit Link</ExternalLink>}
        </div>
      </m.div>
    </LazyMotion>
  )
}

export default AppNotificationItem
