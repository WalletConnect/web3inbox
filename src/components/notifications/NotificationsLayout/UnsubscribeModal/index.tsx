import React, { useCallback } from 'react'

import { useSubscription, useUnsubscribe } from '@web3inbox/react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import { Modal } from '@/components/general/Modal/Modal'
import Spinner from '@/components/general/Spinner'
import Text from '@/components/general/Text'
import { logError } from '@/utils/error'
import { useModals } from '@/utils/hooks'
import { unsubscribeModalService } from '@/utils/store'
import { showDefaultToast, showErrorMessageToast } from '@/utils/toasts'

import './UnsubscribeModal.scss'

export const UnsubscribeModal: React.FC = () => {
  const { unsubscribeModalAppId: domain } = useModals()
  const { data: subscription } = useSubscription(undefined, domain)
  const { unsubscribe, isLoading: loading } = useUnsubscribe(undefined, domain)
  const navigate = useNavigate()

  const handleUnsubscribe = useCallback(async () => {
    if (domain) {
      try {
        unsubscribe().then(() => {
          unsubscribeModalService.closeModal()
          showDefaultToast(`Unsubscribed from ${subscription ? subscription.metadata.name : `dapp`}`)
          navigate('/notifications/new-app')
        })
      } catch (error) {
        logError(error)
        showErrorMessageToast(`Unsubscribing failed, please try again`)
      }
    }
  }, [domain])

  if (!subscription) {
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
          <img src={subscription?.metadata?.icons?.[0] || '/fallback.svg'} alt="logo" />
        </div>
        <div className="UnsubscribeModal__content">
          <div className="UnsubscribeModal__content__title">
            <Text variant="large-600">Unsubscribe from {subscription.metadata.name}</Text>
          </div>
          <div className="UnsubscribeModal__content__helper-text">
            <Text variant="small-500">
              You will stop receiving all notifications from {subscription.metadata.name} on Web3Inbox and
              connected wallets.
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
