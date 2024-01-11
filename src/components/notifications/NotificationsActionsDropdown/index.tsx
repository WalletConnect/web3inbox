import { useCallback } from 'react'

import Dropdown from '@/components/general/Dropdown/Dropdown'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import { unsubscribeModalService } from '@/utils/store'

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
          <CrossIcon />
          <span>Unsubscribe</span>
        </button>
      </div>
    </Dropdown>
  )
}

export default NotificationsActionsDropdown
