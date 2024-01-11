import React, { useCallback, useContext, useState } from 'react'

import { EventEmitter } from 'events'

import Button from '@/components/general/Button'
import W3iContext from '@/contexts/W3iContext/context'
import { JsCommunicator } from '@/w3iProxy/externalCommunicators/jsCommunicator'

import './Connect.scss'

const WidgetConnect: React.FC = () => {
  const { dappIcon, dappName } = useContext(W3iContext)
  const [emitter] = useState(new EventEmitter())

  const onConnect = useCallback(() => {
    const jsCommunicator = new JsCommunicator(emitter)
    jsCommunicator.postToExternalProvider('connect_request', {}, 'chat')
  }, [emitter])

  return (
    <div className="WidgetConnect">
      <div className="WidgetConnect__container">
        <div className="WidgetConnect__icon">
          <img src={dappIcon} alt={dappName} />
        </div>
        <div className="WidgetConnect__text">Connect your wallet</div>
        <div className="WidgetConnect__subtext">
          <span>To enable notifications, connect your wallet.</span>
        </div>
        <div className="WidgetConnect__connect">
          <Button onClick={onConnect} size="small">
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WidgetConnect
