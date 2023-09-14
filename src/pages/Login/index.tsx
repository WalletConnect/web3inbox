import React, { useContext, useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Spinner from '../../components/general/Spinner'
import W3iContext from '../../contexts/W3iContext/context'
import { signatureModalService } from '../../utils/store'
import './Login.scss'
import TransitionDiv from '../../components/general/TransitionDiv'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Button from '../../components/general/Button'
import Sidebar from '../../components/layout/Sidebar'
import IntroContent from '../../components/general/IntroContent'
import IntroWallet from '../../components/general/Icon/IntroWallet'

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

  const modal = useWeb3Modal()

  useEffect(() => {
    const path = next ? decodeURIComponent(next) : '/'

    if (userPubkey) {
      const chatConditionsPass = Boolean(!uiEnabled.chat || chatRegisteredKey)
      // Only need to trigger signatures for notify if none were issued for chat
      const notifyConditionsPass = Boolean(uiEnabled.chat || !uiEnabled.notify || pushRegisteredKey)

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
      <Sidebar isLoggedIn={false} />
      <main className="Main">
        <IntroContent
          title="Welcome to Web3Inbox"
          subtitle="Connect your wallet to start using Web3Inbox today."
          button={
            <Button
              onClick={() => {
                modal.open()
              }}
              style={{ minWidth: 'fit-content' }}
            >
              {'Connect Wallet'}
            </Button>
          }
          icon={<IntroWallet />}
        />
      </main>
    </TransitionDiv>
  )
}

export default Login
