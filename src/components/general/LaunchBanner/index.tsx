import { useState } from 'react'

import { Link } from 'react-router-dom'

import Banner from '@/components/general/Banner'
import ChevronRightIcon from '@/components/general/Icon/ChevronRightIcon'
import { localStorageKeys } from '@/constants/localStorage'
import { LocalStorage } from '@/utils/localStorage'

import './LaunchBanner.scss'

const LAUNCH_BANNER_URL = 'https://walletconnect.com/blog/introducing-web3inbox-app'
const LAUNCH_BANNER_TERMS_URL = 'https://web3inbox.com/terms-soundwaves'

const isBannerClosed = LocalStorage.get(localStorageKeys.launchBannerClosed) === 'true'

export default function LaunchBanner() {
  const [closed, setClosed] = useState(isBannerClosed)

  if (closed) {
    return null
  }

  function handleCloseBanner() {
    setClosed(true)
    localStorage.setItem(localStorageKeys.launchBannerClosed, 'true')
  }

  return (
    <Banner className="LaunchBanner" onClose={handleCloseBanner}>
      The Web3Inbox app is live! Subscribe to Web3Inbox to get your Soundwaves NFT airdrop.{' '}
      <Link className="LaunchBanner__terms" to={LAUNCH_BANNER_TERMS_URL} target="_blank">
        <span>(T&Cs apply)</span>
      </Link>{' '}
      <Link className="LaunchBanner__learn-more" to={LAUNCH_BANNER_URL} target="_blank">
        <span>
          Learn more
          <ChevronRightIcon />
        </span>
      </Link>
    </Banner>
  )
}
