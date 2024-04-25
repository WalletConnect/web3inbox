import React, { useContext, useEffect } from 'react'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/general/Button'
import IntroWallet from '@/components/general/Icon/IntroWallet'
import IntroContent from '@/components/general/IntroContent'
import Text from '@/components/general/Text'
import TransitionDiv from '@/components/general/TransitionDiv'
import Sidebar from '@/components/layout/Sidebar'
import { web3InboxURLs } from '@/constants/navigation'
import W3iContext from '@/contexts/W3iContext/context'

import './Login.scss'

const Login: React.FC = () => {
  const { userPubkey, notifyRegisteredKey } = useContext(W3iContext)
  const { search } = useLocation()
  const next = new URLSearchParams(search).get('next')
  const nav = useNavigate()

  const modal = useWeb3Modal()

  useEffect(() => {
    const path = next ? decodeURIComponent(next) : '/'

    if (userPubkey && notifyRegisteredKey) nav(path)
  }, [userPubkey, next, notifyRegisteredKey])

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
              size="small"
            >
              Connect Wallet
            </Button>
          }
          icon={<IntroWallet />}
        />
        <div className="Main__footer">
          <Text className="Main__footer__title" variant="small-400">
            Learn more at
          </Text>
          <Link
            className="Main__footer__link"
            to={web3InboxURLs.website}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Text variant="small-400">web3inbox.com</Text>
          </Link>
        </div>
      </main>
    </TransitionDiv>
  )
}

export default Login
