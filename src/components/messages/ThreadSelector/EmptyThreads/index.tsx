import React, { useMemo } from 'react'
import SpeechBubble from '../../../../assets/SpeechBubble.svg'
import Compass from '../../../../assets/Compass.svg'
import Card from '../../../../assets/Card.svg'
import EyeSpeechBubble from '../../../../assets/EyeSpeechBubble.svg'
import HandWave from '../../../../assets/HandWave.svg'
import Crypto from '../../../../assets/Crypto.svg'
import Landscape from '../../../../assets/Landscape.svg'
import FeatureInfoBox from '../../../general/FeatureInfoBox'

const EmptyThreads: React.FC = () => {
  const sections = useMemo(
    () => [
      {
        title: 'Find your friends by their ENS username or wallet address',
        icons: [
          {
            icon: Compass,
            alt: 'compass-icon'
          },
          {
            icon: Card,
            alt: 'card-icon'
          }
        ]
      },
      {
        title: 'Invite friends a private, encrypted chat. You’re in control who can message you',
        icons: [
          {
            icon: EyeSpeechBubble,
            alt: 'eye-in-speech-bubble-icon'
          },
          {
            icon: HandWave,
            alt: 'hand-wave-icon'
          }
        ]
      },
      {
        title: 'Send and earn crypto. Trade or sell NFTs. Agree on transactions in real-time chat',
        icons: [
          {
            icon: Crypto,
            alt: 'crypto-icon'
          },
          {
            icon: Landscape,
            alt: 'landscape-icon'
          }
        ]
      }
    ],
    []
  )

  return (
    <FeatureInfoBox
      localStorageKey="w3i-empty-threads-infos"
      header="Chat, send crypto and trade NFTs with your web3 frens"
      mainIcon={{
        icon: SpeechBubble,
        alt: 'speech-bubble-icon'
      }}
      sections={sections}
    />
  )
}

export default EmptyThreads
