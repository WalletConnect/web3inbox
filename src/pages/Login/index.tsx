import React, { useContext, useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import ByWalletConnect from '../../assets/by_walletconnect.png'
import ChatDisplay from '../../assets/chat.png'
import NotificationDisplay from '../../assets/notifs.png'
import Web3InboxDisplay from '../../assets/web3inbox.png'
import MessageIcon from '../../components/general/Icon/MessageIcon'
import NotificationIcon from '../../components/general/Icon/NotificationIcon'
import Spinner from '../../components/general/Spinner'
import W3iContext from '../../contexts/W3iContext/context'
import { signatureModalService } from '../../utils/store'
import './Login.scss'
import { SignatureModal } from './SignatureModal'
import TransitionDiv from '../../components/general/TransitionDiv'
import WalletConnectIcon from '../../components/general/Icon/WalletConnectIcon'
import { useWeb3Modal } from '@web3modal/react'
import Button from '../../components/general/Button'

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
  const {
    userPubkey,
    dappOrigin,
    chatProvider,
    uiEnabled,
    chatRegisteredKey,
    pushRegisteredKey,
    chatRegisterMessage,
    pushRegisterMessage
  } = useContext(W3iContext)
  const { search } = useLocation()
  const next = new URLSearchParams(search).get('next')
  const nav = useNavigate()

  const { open, isOpen } = useWeb3Modal()

  useEffect(() => {
    const path = next ? decodeURIComponent(next) : '/'

    if (userPubkey) {
      const chatConditionsPass = Boolean(!uiEnabled.chat || chatRegisteredKey)
      // Only need to trigger signatures for notify if none were issued for chat
      const notifyConditionsPass = Boolean(
        (!uiEnabled.chat && uiEnabled.notify) || pushRegisteredKey
      )

      if (chatConditionsPass && notifyConditionsPass) {
        nav(path)
        // Else if signature is required.
      } else if (chatRegisterMessage || pushRegisterMessage) {
        signatureModalService.openModal()
      }
    }
  }, [userPubkey, next, chatRegisteredKey, pushRegisteredKey, uiEnabled, chatRegisterMessage])

  if (chatProvider !== 'internal') {
    return (
      <div className="Login">
        <Spinner width="3em" />
      </div>
    )
  }

  if (dappOrigin) {
    return <Navigate to="/widget/connect" />
  }

  return (
    <TransitionDiv className="Login">
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
            {userPubkey &&
            ((!chatRegisteredKey && chatRegisterMessage) ||
              (!pushRegisteredKey && pushRegisterMessage)) ? (
              <SignatureModal
                message={chatRegisterMessage ?? pushRegisterMessage ?? ''}
                sender={chatRegisterMessage ? 'chat' : 'push'}
              />
            ) : (
              <Button
                style={{ minWidth: 'fit-content', width: '6em', whiteSpace: 'nowrap' }}
                onClick={() => {
                  open()
                }}
              >
                {isOpen ? <Spinner width="1em" /> : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="Login__footer">
        <WalletConnectIcon />
        <img src={ByWalletConnect} alt="WC Logo" />
      </div>
    </TransitionDiv>
  )
}

export default Login
