import React, { useEffect } from 'react'
import ByWalletConnect from '../../assets/by_walletconnect.png'
import Logo from '../../assets/Logo.svg'
import Messages from '../../assets/MessagesFilled.svg'
import Notifications from '../../assets/Notifications.svg'
import Web3InboxDisplay from '../../assets/web3inbox.png'
import ChatDisplay from '../../assets/chat.png'
import NotificationDisplay from '../../assets/notifs.png'
import './Login.scss'
import Button from '../../components/general/Button'
import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'
import { useNavigate } from 'react-router-dom'

const Web3InboxFeatures = [
  {
    name: 'Chat',
    description:
      'Message your frens in web3. Transact crypto and trade NFTs in a private, encrypted chat.',
    icon: Messages
  },
  {
    name: 'Push',
    description:
      'Never miss being outbid on your dream NFT, that critical DAO vote, or a new coin listing ever again.',
    icon: Notifications
  }
]

const Login: React.FC = () => {
  const { address } = useAccount()
  const nav = useNavigate()

  useEffect(() => {
    if (address) {
      nav('/')
    }
  }, [address])

  return (
    <div className="Login">
      <div className="Login__container">
        <div className="Login__displays">
          {[
            [Web3InboxDisplay, 'web3inbox'],
            [ChatDisplay, 'chat'],
            [NotificationDisplay, 'notifs']
          ].map(([itemSrc, itemName]) => (
            <img src={itemSrc} alt={itemName} key={itemName} />
          ))}
        </div>
        <div className="Login__splash-text">
          Chat between any two web3 wallets. Get notifications from any web3 app. All in one place,
          your web3inbox.
        </div>
        <div className="Login__web3inbox-features">
          {Web3InboxFeatures.map(({ name, description, icon }) => (
            <div key={name} className="Login__web3inbox-feature">
              <div className="Login__web3inbox-feature-header">
                <img src={icon} alt={name} />
                <span>{name}</span>
              </div>
              <span className="Login__web3inbox-feature-description">{description}</span>
            </div>
          ))}
        </div>
        <div className="Login__actions">
          <div className="Login__actions-container">
            <Web3Button />
            <Button type="secondary">Learn More</Button>
          </div>
        </div>
      </div>
      <div className="Login__footer">
        <img src={Logo} alt="WC Logo" />
        <img src={ByWalletConnect} alt="WC Logo" />
      </div>
    </div>
  )
}

export default Login
