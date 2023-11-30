import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import W3iContext from '../../contexts/W3iContext/context'
import './Login.scss'
import TransitionDiv from '../../components/general/TransitionDiv'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Button from '../../components/general/Button'
import Sidebar from '../../components/layout/Sidebar'
import IntroContent from '../../components/general/IntroContent'
import IntroWallet from '../../components/general/Icon/IntroWallet'

const Login: React.FC = () => {
  const { userPubkey, uiEnabled, notifyRegisteredKey } = useContext(W3iContext)
  const { search } = useLocation()
  const next = new URLSearchParams(search).get('next')
  const nav = useNavigate()

  const modal = useWeb3Modal()

  useEffect(() => {
    const path = next ? decodeURIComponent(next) : '/'

    if (userPubkey) {
      const notifyConditionsPass = Boolean(
        (!uiEnabled.chat || uiEnabled.notify) && notifyRegisteredKey
      )

      if (notifyConditionsPass) {
        nav(path)
      }
    }
  }, [userPubkey, next, notifyRegisteredKey, uiEnabled])

  return (
    <TransitionDiv className="Login">
      <Sidebar isLoggedIn={false} />
      <main className="Main">
        <IntroContent
          title="Welcome to Web3Inbox"
          subtitle="Connect your wallet to start using Web3Inbox today."
          scale={3}
          button={
            <Button
              className="Main__connect-button"
              onClick={() => {
                modal.open()
              }}
            >
              Connect Wallet
            </Button>
          }
          icon={<IntroWallet />}
        />
      </main>
    </TransitionDiv>
  )
}

export default Login
