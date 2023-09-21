import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import SettingsContext from '../../../../contexts/SettingsContext/context'
import W3iContext from '../../../../contexts/W3iContext/context'
import { useColorModeValue, useModals } from '../../../../utils/hooks'
import { unsubscribeModalService } from '../../../../utils/store'
import Button from '../../../general/Button'
import CrossIcon from '../../../general/Icon/CrossIcon'
import { Modal } from '../../../general/Modal/Modal'
import './UnsubscribeModal.scss'
import Text from '../../../general/Text'
import Spinner from '../../../general/Spinner'
import { showErrorMessageToast, showSuccessMessageToast } from '../../../../utils/toasts'
import { useLocation } from 'react-router-dom'

export const UnsubscribeModal: React.FC = () => {
  const location = useLocation()
  const { activeSubscriptions, pushClientProxy } = useContext(W3iContext)
  const { unsubscribeModalAppId } = useModals()
  const [loading, setLoading] = useState(false)

  const app = useMemo(
    () => activeSubscriptions.find(activeApp => activeApp.topic === unsubscribeModalAppId),
    [unsubscribeModalAppId]
  )

  useEffect(() => {
    if (loading) {
      unsubscribeModalService.closeModal()
      showSuccessMessageToast(`Succesfully unsubscribed from ${app ? app.metadata.name : `dapp`}`)
      setLoading(false)
    }
  }, [location])

  const handleUnsubscribe = useCallback(async () => {
    setLoading(true)
    if (pushClientProxy && unsubscribeModalAppId) {
      try {
        await pushClientProxy.deleteSubscription({ topic: unsubscribeModalAppId })
      } catch (error) {
        console.error(error)
        showErrorMessageToast(`Unsubscribing failed, try again later`)
        setLoading(false)
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
          <Text variant="paragraph-600">Unsubscribe</Text>
          <button className="UnsubscribeModal__close" onClick={unsubscribeModalService.closeModal}>
            <CrossIcon />
          </button>
        </div>
        <div className="UnsubscribeModal__hero">
          <img src={app.metadata.icons[0]} alt="logo" />
        </div>
        <div className="UnsubscribeModal__content">
          <div className="UnsubscribeModal__content__title">
            <Text variant="large-600">Unsubscribe from {app.metadata.name}</Text>
          </div>
          <div className="UnsubscribeModal__content__helper-text">
            <Text variant="small-500">
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
          {loading ? (
            <Spinner width="1.25em" />
          ) : (
            <Text variant="small-600">Disable Notifications</Text>
          )}
        </Button>
      </div>
    </Modal>
  )
}
