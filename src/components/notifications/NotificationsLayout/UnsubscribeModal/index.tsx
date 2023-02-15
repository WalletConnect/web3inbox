import React, { useCallback, useContext, useMemo } from 'react'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import { useColorModeValue, useModals } from '../../../../utils/hooks'
import { unsubscribeModalService } from '../../../../utils/store'
import Button from '../../../general/Button'
import CrossIcon from '../../../general/Icon/CrossIcon'
import { Modal } from '../../../general/Modal/Modal'
import { myAppsMock } from '../../AppSelector'
import './UnsubscribeModal.scss'

export const UnsubscribeModal: React.FC = () => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)
  const { unsubscribeModalAppId } = useModals()

  const app = useMemo(
    () => myAppsMock.find(mockApp => mockApp.id === unsubscribeModalAppId),
    [unsubscribeModalAppId]
  )

  const handleUnsubscribe = useCallback(() => {
    console.log({ unsubscribeAppId: app?.id })
    unsubscribeModalService.closeModal()
  }, [app?.id])

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
          <img src={app?.logo} />
        </div>
        <div className="UnsubscribeModal__content">
          <div className="UnsubscribeModal__content__title">Unsubscribe from {app?.name}</div>
          <div className="UnsubscribeModal__content__helper-text">
            You will stop receiving all notifications from {app?.name} on the web inbox and in your
            wallet.
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
