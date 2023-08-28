import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventEmitter } from 'events'
import Button from '../../../components/general/Button'
import W3iContext from '../../../contexts/W3iContext/context'
import W3iBellIcon from '../../../assets/W3iBell.svg'
import './Subscribe.scss'
import { showErrorMessageToast } from '../../../utils/toasts'
import Spinner from '../../../components/general/Spinner'
import { JsCommunicator } from '../../../w3iProxy/externalCommunicators/jsCommunicator'

const WidgetSubscribe: React.FC = () => {
  const {
    pushClientProxy,
    userPubkey,
    dappOrigin,
    dappIcon,
    dappName,
    dappNotificationDescription,
    activeSubscriptions
  } = useContext(W3iContext)

  const nav = useNavigate()
  const [emitter] = useState(new EventEmitter())

  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleOnSubscribe = useCallback(async () => {
    if (!pushClientProxy || !userPubkey) {
      return
    }

    setIsSubscribing(true)
    try {
      /*
       * Not setting isLoading to false as it will transition to a different page once subscription is
       * done.
       */
      await pushClientProxy.subscribe({
        account: `eip155:1:${userPubkey}`,
        metadata: {
          description: dappNotificationDescription,
          icons: [dappIcon],
          name: dappName,
          url: dappOrigin
        }
      })
    } catch (error) {
      showErrorMessageToast('Failed to subscribe')
    } finally {
      setIsSubscribing(false)
    }
  }, [pushClientProxy, dappOrigin, dappIcon, dappName, dappNotificationDescription, userPubkey])

  useEffect(() => {
    const navIfSubFound = () => {
      const dappSub = activeSubscriptions.find(sub => sub.metadata.url === dappOrigin)
      if (dappSub) {
        const communicator = new JsCommunicator(emitter)
        communicator.postToExternalProvider('dapp_subscription_settled', {}, 'notify')
        nav(`/notifications/${dappSub.topic}`)
      }
    }

    navIfSubFound()

    /*
     * The following two event listeners are essentially fail-safes if something goes wrong
     * and navigation doesn't trigger
     */
    pushClientProxy?.observe('sync_update', {
      next: navIfSubFound
    })

    pushClientProxy?.observe('notify_subscription', {
      next: navIfSubFound
    })
  }, [activeSubscriptions, pushClientProxy, nav, dappOrigin, emitter])

  return (
    <div className="WidgetSubscribe">
      <div className="WidgetSubscribe__container">
        <div className="WidgetSubscribe__icon">
          <img src={W3iBellIcon} />
        </div>
        <h1 className="WidgetSubscribe__title">Notifications from {dappName}</h1>
        <p className="WidgetSubscribe__description">{dappNotificationDescription}</p>
        <Button onClick={handleOnSubscribe} disabled={isSubscribing}>
          {isSubscribing ? <Spinner width="1em" /> : <span>Enable (Subscribe in Wallet)</span>}
        </Button>
      </div>
    </div>
  )
}

export default WidgetSubscribe
