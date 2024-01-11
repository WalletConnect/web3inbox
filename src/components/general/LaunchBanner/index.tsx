import { useState } from 'react'

import { Link } from 'react-router-dom'

import Banner from '@/components/general/Banner'
import ChevronRightIcon from '@/components/general/Icon/ChevronRightIcon'
import { localStorageKeys } from '@/constants/localStorage'

import './LaunchBanner.scss'

const LAUNCH_BANNER_URL = 'https://walletconnect.com/blog/introducing-web3inbox-app'

const isBannerClosed = localStorage
  ? localStorage.getItem(localStorageKeys.launchBannerClosed) === 'true'
  : false

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
      <Link to={LAUNCH_BANNER_URL} target="_blank">
        <span className="LaunchBanner__learn-more">
          Learn more
          <ChevronRightIcon />
        </span>
      </Link>
    </Banner>
  )
}
