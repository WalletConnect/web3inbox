import { useCallback } from 'react'
import { preferencesModalService, unsubscribeModalService } from '../../../utils/store'
import Dropdown from '../../general/Dropdown/Dropdown'
import CheckIcon from '../../general/Icon/CheckIcon'
import CrossIcon from '../../general/Icon/CrossIcon'
import NotificationMuteIcon from '../../general/Icon/NotificationMuteIcon'
import PreferencesIcon from '../../general/Icon/PreferencesIcon'
import TrashIcon from '../../general/Icon/TrashIcon'
import './NotificationsActionsDropdown.scss'

interface INotificationsActionsDropdownProps {
  appId: string
  btnShape?: 'circle' | 'square'
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  w: string
  h: string
  closeDropdown?: () => void
}

const NotificationsActionsDropdown: React.FC<INotificationsActionsDropdownProps> = ({
  appId,
  btnShape = 'circle',
  dropdownPlacement = 'bottomRight',
  w,
  h,
  closeDropdown
}) => {
  const handleMarkAsRead = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log({ appId })
    if (closeDropdown) {
      closeDropdown()
    }
  }, [])

  const handleMuteOrUnmute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (closeDropdown) {
      closeDropdown()
    }
  }, [])

  const handleUnsubscribe = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      unsubscribeModalService.toggleModal(appId)
      if (closeDropdown) {
        closeDropdown()
      }
    },
    [appId]
  )

  const handleClearAll = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (closeDropdown) {
      closeDropdown()
    }
  }, [])

  const handlePreferences = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      preferencesModalService.toggleModal(appId)
      if (closeDropdown) {
        closeDropdown()
      }
    },
    [appId]
  )

  return (
    <Dropdown btnShape={btnShape} h={h} w={w} dropdownPlacement={dropdownPlacement}>
      <div className="NotificationsActionsDropdown__actions">
        <button onClick={handleMarkAsRead}>
          <CheckIcon />
          <span>Mark as read</span>
        </button>
        <button onClick={handleMuteOrUnmute}>
          <NotificationMuteIcon />
          <span>{Math.random() > 0.5 ? 'Unmute' : 'Mute'}</span>
        </button>
        <button onClick={handleClearAll}>
          <TrashIcon />
          <span>Clear All</span>
        </button>
        <button onClick={handlePreferences}>
          <PreferencesIcon />
          <span>Notification Preferences</span>
        </button>
        <button
          className="NotificationsActions__dropdown__block__actions__unsubscribe"
          onClick={handleUnsubscribe}
        >
          <CrossIcon fillColor="hsla(5, 85%, 60%, 1)" />
          <span>Unsubscribe</span>
        </button>
      </div>
    </Dropdown>
  )
}

export default NotificationsActionsDropdown
