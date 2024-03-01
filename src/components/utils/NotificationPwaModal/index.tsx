import React, { Fragment, useContext } from 'react'

import { useWeb3InboxClient } from '@web3inbox/react'

import BackgroundImage from '@/assets/IntroBackground.png'
import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import { Modal } from '@/components/general/Modal/Modal'
import Text from '@/components/general/Text'
import { getFirebaseToken } from '@/utils/firebase'
import { closeNotificationModal, requireNotifyPermission } from '@/utils/notifications'
import { pwaModalService } from '@/utils/store'

import './NotificationPwaModal.scss'

export const NotificationPwaModal: React.FC = () => {
  const explicitlyDeniedPermissionForNotifications = window.Notification?.permission === 'denied'
  const { data: client } = useWeb3InboxClient()

  const handleEnableNotifications = async () => {
    const notificationPermissionGranted = await requireNotifyPermission()

    if (notificationPermissionGranted && client) {
      await client.registerWithPushServer(await getFirebaseToken())
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
