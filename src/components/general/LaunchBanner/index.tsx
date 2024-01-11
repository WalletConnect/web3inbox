import { Link } from 'react-router-dom'

import Banner from '@/components/general/Banner'
import ChevronRightIcon from '@/components/general/Icon/ChevronRightIcon'

import './LaunchBanner.scss'

const LAUNCH_BANNER_URL = 'https://walletconnect.com/blog/introducing-web3inbox-app'

export default function LaunchBanner() {
  return (
    <Banner className="LaunchBanner">
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
