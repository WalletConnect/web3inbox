import { Web3Button } from '@web3modal/react'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ByWalletConnect from '../../assets/by_walletconnect.png'
import ChatDisplay from '../../assets/chat.png'
import Logo from '../../assets/Logo.svg'
import NotificationDisplay from '../../assets/notifs.png'
import Web3InboxDisplay from '../../assets/web3inbox.png'
import Button from '../../components/general/Button'
import MessageIcon from '../../components/general/Icon/MessageIcon'
import NotificationIcon from '../../components/general/Icon/NotificationIcon'
import W3iContext from '../../contexts/W3iContext/context'
import './Login.scss'

const Web3InboxFeatures = [
  {
    name: 'Chat',
    description:
      'Message your frens in web3. Transact crypto and trade NFTs in a private, encrypted chat.',
    icon: <MessageIcon />
  },
  {
    name: 'Push',
    description:
      'Never miss being outbid on your dream NFT, that critical DAO vote, or a new coin listing ever again.',
    icon: <NotificationIcon />
  }
]

const Login: React.FC = () => {
  const { userPubkey } = useContext(W3iContext)
  const nav = useNavigate()

  useEffect(() => {
    if (!userPubkey) {
      nav('/login')
    }
    if (userPubkey) {
      nav('/')
    }
  }, [userPubkey])

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
                {icon}
                <span>{name}</span>
              </div>
              <span className="Login__web3inbox-feature-description">{description}</span>
            </div>
          ))}
        </div>
        <div className="Login__actions">
          <div className="Login__actions-container">
            <Web3Button />
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
