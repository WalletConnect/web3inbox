import React, { Fragment, useContext } from 'react'

import BackgroundImage from '@/assets/IntroBackground.png'
import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import { Modal } from '@/components/general/Modal/Modal'
import Text from '@/components/general/Text'
import W3iContext from '@/contexts/W3iContext/context'
import { closeNotificationModal, requireNotifyPermission } from '@/utils/notifications'
import { pwaModalService } from '@/utils/store'

import './NotificationPwaModal.scss'

export const NotificationPwaModal: React.FC = () => {
  const { notifyClientProxy } = useContext(W3iContext)

  const explicitlyDeniedPermissionForNotifications = window.Notification?.permission === 'denied'

  const handleEnableNotifications = async () => {
    const notificationPermissionGranted = await requireNotifyPermission()

    if (!notifyClientProxy) {
      return
    }

    if (notificationPermissionGranted) {
      await notifyClientProxy.registerWithEcho()
    }
  }

  return (
    <Modal onCloseModal={pwaModalService.closeModal}>
      <div className="NotificationPwaModal">
        <div className="NotificationPwaModal__header">
          <Button
            className="NotificationPwaModal__close-button"
            customType="action-icon"
            onClick={closeNotificationModal}
          >
            <CrossIcon />
          </Button>
        </div>
        <div className="NotificationPwaModal__background">
          <img src={BackgroundImage} />
        </div>
        <div className="NotificationPwaModal__icon">
          <img alt="Web3Inbox icon" className="wc-icon" src="/icon.png" />
        </div>
        <Text variant={'large-500'}>Enable Notifications</Text>
        <Text variant="small-500">
          To use Web3Inbox and receive notifications from your subscribed apps, please enable push
          notifications.
        </Text>
        {explicitlyDeniedPermissionForNotifications ? (
          <Text variant="small-700" className="NotificationPwaModal__warning">
            You have explicitly denied notification permissions. Please adjust in OS settings.
          </Text>
        ) : (
          <Fragment>
            <Text variant="small-500">
              You can always adjust your permissions in your OS settings.
            </Text>
            <Button onClick={handleEnableNotifications} size="small">
              Enable Notifications
            </Button>
          </Fragment>
        )}
      </div>
    </Modal>
  )
}

export default NotificationPwaModal
