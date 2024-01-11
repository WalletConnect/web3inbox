import React, { useCallback, useContext, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import { Modal } from '@/components/general/Modal/Modal'
import Spinner from '@/components/general/Spinner'
import Text from '@/components/general/Text'
import W3iContext from '@/contexts/W3iContext/context'
import { useModals } from '@/utils/hooks'
import { unsubscribeModalService } from '@/utils/store'
import { showErrorMessageToast, showSuccessMessageToast } from '@/utils/toasts'

import './UnsubscribeModal.scss'

export const UnsubscribeModal: React.FC = () => {
  const { activeSubscriptions, notifyClientProxy } = useContext(W3iContext)
  const { unsubscribeModalAppId } = useModals()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const app = useMemo(
    () => activeSubscriptions.find(activeApp => activeApp.topic === unsubscribeModalAppId),
    [unsubscribeModalAppId]
  )

  const handleUnsubscribe = useCallback(async () => {
    setLoading(true)
    if (notifyClientProxy && unsubscribeModalAppId) {
      try {
        notifyClientProxy.observeOne('notify_delete', {
          next: () => {
            unsubscribeModalService.closeModal()
            showSuccessMessageToast(
              `Successfully unsubscribed from ${app ? app.metadata.name : `dapp`}`
            )
            setLoading(false)
            navigate('/notifications/new-app')
          }
        })
        await notifyClientProxy.deleteSubscription({ topic: unsubscribeModalAppId })
      } catch (error) {
        console.error(error)
        showErrorMessageToast(`Unsubscribing failed, please try again`)
        setLoading(false)
      }
    }
  }, [notifyClientProxy, unsubscribeModalAppId])

  if (!app) {
    return null
  }

  return (
    <Modal onCloseModal={unsubscribeModalService.closeModal}>
      <div className="UnsubscribeModal">
        <div className="UnsubscribeModal__header">
          <Text variant="paragraph-600">Unsubscribe</Text>
          <button className="UnsubscribeModal__close" onClick={unsubscribeModalService.closeModal}>
            <CrossIcon />
          </button>
        </div>
        <div className="UnsubscribeModal__hero">
          <img src={app?.metadata?.icons?.[0] || '/fallback.svg'} alt="logo" />
        </div>
        <div className="UnsubscribeModal__content">
          <div className="UnsubscribeModal__content__title">
            <Text variant="large-600">Unsubscribe from {app.metadata.name}</Text>
          </div>
          <div className="UnsubscribeModal__content__helper-text">
            <Text variant="small-500">
              You will stop receiving all notifications from {app.metadata.name} on the Web3Inbox
              and connected wallets.
              <br />
              You can re-subscribe at any time later.
            </Text>
          </div>
        </div>
        <Button
          customType="danger"
          className="UnsubscribeModal__action"
          onClick={handleUnsubscribe}
        >
          {loading ? <Spinner /> : <Text variant="small-600">Unsubscribe</Text>}
        </Button>
      </div>
    </Modal>
  )
}
