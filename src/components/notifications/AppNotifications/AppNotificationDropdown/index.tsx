import { useCallback, useContext } from 'react'

import Dropdown from '@/components/general/Dropdown/Dropdown'
import CrossIcon2 from '@/components/general/Icon/CrossIcon2'
import PreferencesIcon from '@/components/general/Icon/PreferencesIcon'
import { preferencesModalService, unsubscribeModalService } from '@/utils/store'

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
  const handleUnsubscribe = useCallback(() => {
    closeDropdown()
    unsubscribeModalService.toggleModal(notificationId)
  }, [notificationId, closeDropdown, unsubscribeModalService])

  const handleOpenNotificationPreferencesModal = useCallback(() => {
    preferencesModalService.toggleModal(notificationId)
    closeDropdown()
  }, [closeDropdown, notificationId])

  return (
    <Dropdown btnShape="square" h={h} w={w} dropdownPlacement={dropdownPlacement}>
      <div className="AppNotificationDropdown__actions">
        <button onClick={handleOpenNotificationPreferencesModal}>
          <PreferencesIcon />
          <span>Preferences</span>
        </button>
        <button
          className="AppNotificationDropdown__actions__unsubscribe"
          onClick={handleUnsubscribe}
        >
          <CrossIcon2 />
          <span>Unsubscribe</span>
        </button>
      </div>
    </Dropdown>
  )
}

export default AppNotificationDropdown
