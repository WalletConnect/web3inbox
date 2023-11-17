import React, { Fragment, useContext } from 'react'
import { Modal } from '../../general/Modal/Modal'
import { pwaModalService } from '../../../utils/store'
import BackgroundImage from '../../../assets/IntroBackground.png'
import WalletConnectIcon from '../../general/Icon/WalletConnectIcon'
import './NotificationPwaModal.scss'
import Text from '../../general/Text'
import Button from '../../general/Button'
import W3iContext from '../../../contexts/W3iContext/context'
import { requireNotifyPermission } from '../../../utils/notifications'

export const NotificationPwaModal: React.FC = () => {
  const { notifyClientProxy } = useContext(W3iContext)

  const handleEnableNotifications = async () => {
    const notificationPermissionGranted = await requireNotifyPermission()

    if (!notifyClientProxy) {
      return
    }

    if (notificationPermissionGranted) {
      await notifyClientProxy.registerWithEcho()
    }
  }

  const explicitlyDeniedPermissionForNotifications = window.Notification?.permission === 'denied'

  return (
    <Modal onToggleModal={pwaModalService.toggleModal}>
      <div className="NotificationPwaModal">
        <div className="NotificationPwaModal__background">
          <img src={BackgroundImage} />
        </div>
        <div className="NotificationPwaModal__icon">
          <WalletConnectIcon hoverable={false} />
        </div>
        <div className="NotificationPwaModal__header">
          <Text variant={'large-500'}>Enable Notifications</Text>
        </div>
        <div className="NotificationPwaModal__description">
          <Text variant="small-500">
            To use Web3Inbox and receive notifications from your subscribed apps, please enable push
            notifications.
          </Text>
        </div>
        {explicitlyDeniedPermissionForNotifications ? (
          <Text variant="small-700" className="NotificationPwaModal__warning">
            You have explicitly denied notification permissions. Please adjust in OS settings.
          </Text>
        ) : (
          <Fragment>
            <div className="NotificationPwaModal_subtitle">
              <Text variant="small-500">
                You can always adjust your permissions in your OS settings.
              </Text>
            </div>
            <Button onClick={handleEnableNotifications}>Enable Notifications</Button>
          </Fragment>
        )}
      </div>
    </Modal>
  )
}

export default NotificationPwaModal
