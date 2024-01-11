import React, { useCallback, useContext, useEffect, useState } from 'react'

import { EventEmitter } from 'events'
import { useNavigate } from 'react-router-dom'

import W3iBellIcon from '@/assets/W3iBell.svg'
import Button from '@/components/general/Button'
import Spinner from '@/components/general/Spinner'
import W3iContext from '@/contexts/W3iContext/context'
import { showErrorMessageToast } from '@/utils/toasts'
import { JsCommunicator } from '@/w3iProxy/externalCommunicators/jsCommunicator'

import './Subscribe.scss'

const WidgetSubscribe: React.FC = () => {
  const {
    notifyClientProxy,
    userPubkey,
    dappOrigin,
    dappIcon,
    dappName,
    dappNotificationDescription,
    activeSubscriptions
  } = useContext(W3iContext)

  const nav = useNavigate()

  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleOnSubscribe = useCallback(async () => {
    if (!notifyClientProxy || !userPubkey) {
      return
    }

    setIsSubscribing(true)
    try {
      /*
       * Not setting isLoading to false as it will transition to a different page once subscription is
       * done.
       */
      await notifyClientProxy.subscribe({
        account: userPubkey,
        appDomain: new URL(dappOrigin).host
      })
    } catch (error) {
      showErrorMessageToast('Failed to subscribe')
    } finally {
      setIsSubscribing(false)
    }
  }, [notifyClientProxy, dappOrigin, dappIcon, dappName, dappNotificationDescription, userPubkey])

  useEffect(() => {
    const dappSub = activeSubscriptions.find(sub => sub.metadata.appDomain === dappOrigin)
    if (dappSub) {
      setTimeout(() => {
        const communicator = new JsCommunicator(new EventEmitter())
        communicator.postToExternalProvider('dapp_subscription_settled', {}, 'notify')
      }, 10)
      setTimeout(() => {
        nav(`/notifications/${dappSub.topic}`)
      }, 0)
    }
  }, [activeSubscriptions, nav])

  return (
    <div className="WidgetSubscribe">
      <div className="WidgetSubscribe__container">
        <div className="WidgetSubscribe__icon">
          <img src={W3iBellIcon} />
        </div>
        <h1 className="WidgetSubscribe__title">Notifications from {dappName}</h1>
        <p className="WidgetSubscribe__description">{dappNotificationDescription}</p>
        <Button onClick={handleOnSubscribe} disabled={isSubscribing}>
          {isSubscribing ? <Spinner /> : <span>Enable (Subscribe in Wallet)</span>}
        </Button>
      </div>
    </div>
  )
}

export default WidgetSubscribe
