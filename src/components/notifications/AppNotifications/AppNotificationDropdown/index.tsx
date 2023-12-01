import { useCallback, useContext } from 'react'
import W3iContext from '../../../../contexts/W3iContext/context'
import { preferencesModalService, unsubscribeModalService } from '../../../../utils/store'
import Dropdown from '../../../general/Dropdown/Dropdown'
import './AppNotificationDropdown.scss'
import CrossIcon2 from '../../../general/Icon/CrossIcon2'
import PreferencesIcon from '../../../general/Icon/PreferencesIcon'

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
  const { notifyClientProxy } = useContext(W3iContext)

  const handleUnsubscribe = useCallback(() => {
    closeDropdown()
    unsubscribeModalService.toggleModal(notificationId)
  }, [notificationId, closeDropdown, unsubscribeModalService, notifyClientProxy])

  const handleOpenNotificationPreferencesModal = useCallback(() => {
    preferencesModalService.toggleModal(notificationId)
    closeDropdown()
  }, [closeDropdown])

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
