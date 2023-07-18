import React, { useCallback, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/general/Button'
import W3iContext from '../../../contexts/W3iContext/context'
import W3iBellIcon from '../../../assets/W3iBell.svg'
import './Subscribe.scss'

const WidgetSubscribe: React.FC = () => {
  const {
    pushClientProxy,
    userPubkey,
    dappContext,
    dappIcon,
    dappName,
    dappNotificationDescription,
    activeSubscriptions
  } = useContext(W3iContext)

  const nav = useNavigate()

  const handleOnSubscribe = useCallback(() => {
    if (!pushClientProxy || !userPubkey) {
      return
    }

    pushClientProxy.subscribe({
      account: `eip155:1:${userPubkey}`,
      metadata: {
        description: dappNotificationDescription,
        icons: [dappIcon],
        name: dappName,
        url: dappContext
      }
    })
  }, [pushClientProxy, dappContext, dappIcon, dappName, dappNotificationDescription, userPubkey])

  useEffect(() => {
    const dappSub = activeSubscriptions.find(sub => sub.metadata.url === dappContext)
    console.log({ activeSubscriptions })
    if (dappSub) {
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
        <Button onClick={handleOnSubscribe}>Enable (Subscribe in Wallet)</Button>
      </div>
    </div>
  )
}

export default WidgetSubscribe
