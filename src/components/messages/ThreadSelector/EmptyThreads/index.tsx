import React from 'react'

import Card from '@/assets/Card.png'
import Compass from '@/assets/Compass.png'
import EyeSpeechBubble from '@/assets/EyeSpeechBubble.png'
import FramedPicture from '@/assets/FramedPicture.png'
import MoneyWithWings from '@/assets/MoneyWithWings.png'
import SpeechBubble from '@/assets/SpeechBubble.png'
import WavingHand from '@/assets/WavingHand.png'
import FeatureInfoBox from '@/components/general/FeatureInfoBox'
import type { ISection } from '@/utils/types'

const sections: ISection[] = [
  {
    title: 'Find your friends by their ENS username or wallet address',
    icons: [
      {
        icon: Compass,
        alt: 'compass-icon',
        shape: 'circle',
        bgColor: 'blue'
      },
      {
        icon: Card,
        alt: 'card-icon',
        shape: 'square',
        bgColor: 'orange'
      }
    ]
  },
  {
    title: 'Invite friends a private, encrypted chat. You’re in control who can message you',
    icons: [
      {
        icon: EyeSpeechBubble,
        alt: 'eye-in-speech-bubble-icon',
        shape: 'square',
        bgColor: 'pink'
      },
      {
        icon: WavingHand,
        alt: 'waving-hand-icon',
        shape: 'circle',
        bgColor: 'purple'
      }
    ]
  },
  {
    title: 'Send and earn crypto. Trade or sell NFTs. Agree on transactions in real-time chat',
    icons: [
      {
        icon: MoneyWithWings,
        alt: 'money-with-wings-icon',
        shape: 'circle',
        bgColor: 'green'
      },
      {
        icon: FramedPicture,
        alt: 'landscape-icon',
        shape: 'circle',
        bgColor: 'blue'
      }
    ]
  }
]

const EmptyThreads: React.FC = () => {
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
