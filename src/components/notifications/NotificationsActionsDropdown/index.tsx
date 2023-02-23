import { useCallback } from 'react'
import { unsubscribeModalService } from '../../../utils/store'
import Dropdown from '../../general/Dropdown/Dropdown'
import CrossIcon from '../../general/Icon/CrossIcon'
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

  return (
    <Dropdown btnShape={btnShape} h={h} w={w} dropdownPlacement={dropdownPlacement}>
      <div className="NotificationsActionsDropdown__actions">
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
