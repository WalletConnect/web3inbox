import React, { useCallback, useContext } from 'react'
import Button from '../../../components/general/Button'
import W3iContext from '../../../contexts/W3iContext/context'

const WidgetSubscribe: React.FC = () => {
  const {
    pushClientProxy,
    userPubkey,
    dappContext,
    dappIcon,
    dappName,
    dappNotificationDescription
  } = useContext(W3iContext)

  const handleOnSubscribe = useCallback(() => {
    if (!pushClientProxy || !userPubkey) {
      return
    }
    console.log({ dappName, dappIcon, dappContext })

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

  return (
    <div className="WidgetSubscribe">
      <h1 className="WidgetSubscribe__title">Notifications from {dappName}</h1>
      <p className="WidgetSubscribe__description">{dappNotificationDescription}</p>
      <Button onClick={handleOnSubscribe}>Enable (Subscribe in Wallet)</Button>
    </div>
  )
}

export default WidgetSubscribe
