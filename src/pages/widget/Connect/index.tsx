import React, { useContext } from 'react'
import W3iContext from '../../../contexts/W3iContext/context'
import './Connect.scss'

const WidgetConnect: React.FC = () => {
  const { dappIcon, dappName } = useContext(W3iContext)

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
      </div>
    </div>
  )
}

export default WidgetConnect
