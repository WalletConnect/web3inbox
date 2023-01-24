import React, { Fragment, useCallback, useState } from 'react'
import './EmptyThreads.scss'
import SpeechBubble from '../../../../assets/SpeechBubble.svg'
import Compass from '../../../../assets/Compass.svg'
import Card from '../../../../assets/Card.svg'
import EyeSpeechBubble from '../../../../assets/EyeSpeechBubble.svg'
import HandWave from '../../../../assets/HandWave.svg'
import Crypto from '../../../../assets/Crypto.svg'
import Landscape from '../../../../assets/Landscape.svg'
import CrossIcon from '../../../general/Icon/CrossIcon'
import Button from '../../../general/Button'

const EmptyThreads: React.FC = () => {
  const [isEmptyThreadsClosed, setIsEmptyThreadsClosed] = useState(
    () => localStorage.getItem('w3i-empty-threads-infos') === 'keep-closed'
  )
  const handleCloseInfoBox = useCallback(() => {
    localStorage.setItem('w3i-empty-threads-infos', 'keep-closed')
    setIsEmptyThreadsClosed(true)
  }, [])

  return isEmptyThreadsClosed ? (
    <Fragment />
  ) : (
    <div className="empty-threads">
      <Button className="empty-threads__close" onClick={handleCloseInfoBox}>
        <CrossIcon fillColor="rgba(228, 231, 231, 1)" />
      </Button>
      <div className="empty-threads__container">
        <img src={SpeechBubble} alt="speech-bubble-icon" />
        <div className="empty-threads__container__functionalities">
          Chat, send crypto and trade NFTs with your web3 frens
        </div>
        <div className="empty-threads__container__functionality">
          <div className="empty-threads__container__functionality__icons">
            <img src={Compass} alt="compass-icon" />
            <img src={Card} alt="card-icon" />
          </div>
          Find your friends by their ENS username or wallet address
        </div>
        <div className="empty-threads__container__functionality">
          <div className="empty-threads__container__functionality__icons">
            <img src={EyeSpeechBubble} alt="eye-in-speech-bubble-icon" />
            <img src={HandWave} alt="hand-wave-icon" />
          </div>
          Invite friends a private, encrypted chat. You’re in control who can message you
        </div>
        <div className="empty-threads__container__functionality">
          <div className="empty-threads__container__functionality__icons">
            <img src={Crypto} alt="crypto-icon" />
            <img src={Landscape} alt="landscape-icon" />
          </div>
          Send and earn crypto. Trade or sell NFTs. Agree on transactions in real-time chat
        </div>
      </div>
    </div>
  )
}

export default EmptyThreads
