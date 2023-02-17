import { useCallback } from 'react'
import Dropdown from '../../../general/Dropdown/Dropdown'
import CheckIcon from '../../../general/Icon/CheckIcon'
import NotificationMuteIcon from '../../../general/Icon/NotificationMuteIcon'
import TrashIcon from '../../../general/Icon/TrashIcon'
import './AppNotificationDropdown.scss'

interface IAppNotificationDropdownProps {
  notificationId: string
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  w: string
  h: string
  closeDropdown: () => void
}

const AppNotificationDropdown: React.FC<IAppNotificationDropdownProps> = ({
  notificationId,
  dropdownPlacement = 'bottomRight',
  w,
  h,
  closeDropdown
}) => {
  const handleMarkAsRead = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log({ notificationId })
    closeDropdown()
  }, [])

  const handleClear = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    closeDropdown()
  }, [])

  const handleMute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    closeDropdown()
  }, [])

  return (
    <Dropdown btnShape="square" h={h} w={w} dropdownPlacement={dropdownPlacement}>
      <div className="AppNotificationDropdown__actions">
        <button onClick={handleMarkAsRead}>
          <CheckIcon />
          <span>Mark as read</span>
        </button>
        <button onClick={handleClear}>
          <TrashIcon />
          <span>Clear</span>
        </button>
        <button onClick={handleMute}>
          <NotificationMuteIcon />
          <span>Stop Offer Notifications</span>
        </button>
      </div>
    </Dropdown>
  )
}

export default AppNotificationDropdown
