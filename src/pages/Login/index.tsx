import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import W3iContext from '../../contexts/W3iContext/context'
import { useAccount } from 'wagmi'
import { Web3Button } from '@web3modal/react'
import ChatMainImage from '../../assets/chat_main.png'
import Feature11Image from '../../assets/feature_1_1.png'
import Feature12Image from '../../assets/feature_1_2.png'
import Feature21Image from '../../assets/feature_2_1.png'
import Feature22Image from '../../assets/feature_2_2.png'
import Feature31Image from '../../assets/feature_3_1.png'
import Feature32Image from '../../assets/feature_3_2.png'
import PushMainImage from '../../assets/push_notifications_main.png'
import PushFeature11Image from '../../assets/push_feature_1_1.png'
import PushFeature12Image from '../../assets/push_feature_1_2.png'
import PushFeature21Image from '../../assets/push_feature_2_1.png'
import PushFeature22Image from '../../assets/push_feature_2_2.png'
import './Login.scss'

const ChatImages = [
  {
    items: [
      {
        image: ChatMainImage,
        width: 1024,
        id: 'chat_main',
        extraStyle: {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0px 6px 14px -6px rgba(0, 0, 0, 0.5), 0px 10px 32px -4px rgba(0, 0, 0, 0.64)'
        }
      }
    ],
    height: 720
  },
  {
    items: [
      { image: Feature11Image, width: 636, id: 'feature_1_1', extraStyle: {} },
      { image: Feature12Image, width: 312, id: 'feature_1_2', extraStyle: {} }
    ],
    height: 406
  },
  {
    items: [
      { image: Feature21Image, width: 474, id: 'feature_2_1', extraStyle: {} },
      { image: Feature22Image, width: 474, id: 'feature_2_2', extraStyle: {} }
    ],
    height: 501
  },
  {
    items: [
      { image: Feature31Image, width: 312, id: 'feature_3_1', extraStyle: {} },
      { image: Feature32Image, width: 636, id: 'feature_3_2', extraStyle: {} }
    ],
    height: 454
  }
]

const PushImages: typeof ChatImages = [
  {
    items: [
      {
        image: PushMainImage,
        width: 1024,
        id: 'chat_main',
        extraStyle: {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0px 6px 14px -6px rgba(0, 0, 0, 0.12), 0px 10px 32px -4px rgba(0, 0, 0, 0.1)'
        }
      }
    ],
    height: 720
  },
  {
    items: [
      { image: PushFeature11Image, width: 636, id: 'feature_1_1', extraStyle: {} },
      { image: PushFeature12Image, width: 312, id: 'feature_1_2', extraStyle: {} }
    ],
    height: 472
  },
  {
    items: [
      { image: PushFeature21Image, width: 316, id: 'feature_2_1', extraStyle: {} },
      { image: PushFeature22Image, width: 632, id: 'feature_2_2', extraStyle: {} }
    ],
    height: 368
  }
]

const rowsToComponent = (rows: typeof ChatImages) => {
  return rows.map(({ items, height }, idx) => (
    <div className="Landing__row" key={idx}>
      {items.map(({ image, width, id, extraStyle }) => (
        <div className="Landing__feature-image" key={id}>
          <img
            src={image}
            alt={id}
            style={{ width: `${width}px`, height: `${height}px`, ...extraStyle }}
          />
        </div>
      ))}
    </div>
  ))
}

const Login: React.FC = () => {
  const { userPubkey } = useContext(W3iContext)
  const { isDisconnected } = useAccount()
  const nav = useNavigate()

  useEffect(() => {
    if (!userPubkey && isDisconnected) {
      nav('/login')
    }
    if (userPubkey) {
      nav('/')
    }
  }, [userPubkey, isDisconnected])

  return (
    <div className="Landing">
      <div className="Landing__header">
        <div className="Landing__header-title">Where web3 communicates</div>
        <div className="Landing__header-subtext">
          Web3Inbox is the messaging app for your onchain life. From chatting with frens to
          receiving real-time notifications, you can now stay up-to-date like never before.
        </div>
        <Web3Button label="Connect Wallet" />
      </div>
      <div className="Landing__feature-sets">
        <div className="Landing__features">{rowsToComponent(ChatImages)}</div>
        <div className="Landing__features">{rowsToComponent(PushImages)}</div>
      </div>
    </div>
  )
}

export default Login
