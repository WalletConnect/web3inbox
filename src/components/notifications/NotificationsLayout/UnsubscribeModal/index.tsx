import React, { useCallback, useContext, useMemo } from 'react'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import W3iContext from '../../../../contexts/W3iContext/context'
import { useColorModeValue, useModals } from '../../../../utils/hooks'
import { unsubscribeModalService } from '../../../../utils/store'
import Button from '../../../general/Button'
import CrossIcon from '../../../general/Icon/CrossIcon'
import { Modal } from '../../../general/Modal/Modal'
import './UnsubscribeModal.scss'

export const UnsubscribeModal: React.FC = () => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)
  const { activeSubscriptions } = useContext(W3iContext)
  const { unsubscribeModalAppId } = useModals()

  const app = useMemo(
    () => activeSubscriptions.find(mockApp => mockApp.topic === unsubscribeModalAppId),
    [unsubscribeModalAppId]
  )

  const handleUnsubscribe = useCallback(() => {
    unsubscribeModalService.closeModal()
  }, [])

  return (
    <Modal onToggleModal={unsubscribeModalService.toggleModal}>
      <div className="UnsubscribeModal">
        <div className="UnsubscribeModal__header">
          <h2>Unsubscribe</h2>
          <Button
            className="UnsubscribeModal__close"
            customType="action-icon"
            onClick={unsubscribeModalService.closeModal}
          >
            <CrossIcon fillColor={themeColors['--fg-color-1']} />
          </Button>
        </div>
        <div className="UnsubscribeModal__hero">
          <img src={app?.metadata?.icons[0] ?? ''} alt="logo" />
        </div>
        <div className="UnsubscribeModal__content">
          <div className="UnsubscribeModal__content__title">
            Unsubscribe from {app?.metadata?.name ?? ''}
          </div>
          <div className="UnsubscribeModal__content__helper-text">
            You will stop receiving all notifications from {app?.metadata?.name} on the web inbox
            and in your wallet.
            <br />
            You can re-subscribe later
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
