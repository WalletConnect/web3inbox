import React, { useCallback, useContext, useMemo } from 'react'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import W3iContext from '../../../../contexts/W3iContext/context'
import { useColorModeValue, useModals } from '../../../../utils/hooks'
import { unsubscribeModalService } from '../../../../utils/store'
import Button from '../../../general/Button'
import CrossIcon from '../../../general/Icon/CrossIcon'
import { Modal } from '../../../general/Modal/Modal'
import './UnsubscribeModal.scss'
import Text from '../../../general/Text'

export const UnsubscribeModal: React.FC = () => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)
  const { activeSubscriptions, pushClientProxy } = useContext(W3iContext)
  const { unsubscribeModalAppId } = useModals()

  const app = useMemo(
    () => activeSubscriptions.find(activeApp => activeApp.topic === unsubscribeModalAppId),
    [unsubscribeModalAppId]
  )

  const handleUnsubscribe = useCallback(async () => {
    if (pushClientProxy && unsubscribeModalAppId) {
      try {
        pushClientProxy.observeOne('notify_delete', {
          next: () => {
            unsubscribeModalService.closeModal()
          }
        })
        await pushClientProxy.deleteSubscription({ topic: unsubscribeModalAppId })
      } catch (error) {
        console.error(error)
      }
    }
  }, [pushClientProxy, unsubscribeModalAppId])

  if (!app) {
    return null
  }

  return (
    <Modal onToggleModal={unsubscribeModalService.toggleModal}>
      <div className="UnsubscribeModal">
        <div className="UnsubscribeModal__header">
          <Text variant="large-500">Unsubscribe</Text>
          <Button
            className="UnsubscribeModal__close"
            customType="action-icon"
            onClick={unsubscribeModalService.closeModal}
          >
            <CrossIcon fillColor={themeColors['--fg-color-1']} />
          </Button>
        </div>
        <div className="UnsubscribeModal__hero">
          <img src={app.metadata.icons[0]} alt="logo" />
        </div>
        <div className="UnsubscribeModal__content">
          <div className="UnsubscribeModal__content__title">
            <Text variant="paragraph-500">Unsubscribe from {app.metadata.name}</Text>
          </div>
          <div className="UnsubscribeModal__content__helper-text">
            <Text variant="small-400">
              You will stop receiving all notifications from {app.metadata.name} on the web inbox
              and in your wallet.
              <br />
              You can re-subscribe later
            </Text>
          </div>
        </div>
        <Button
          customType="danger"
          className="UnsubscribeModal__action"
          onClick={handleUnsubscribe}
        >
          Disable Notifications
        </Button>
      </div>
    </Modal>
  )
}
