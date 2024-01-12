import React from 'react'

import { Link } from 'react-router-dom'

import DiscordIcon from '@/components/general/Icon/DiscordIcon'
import Text from '@/components/general/Text'
import MobileHeader from '@/components/layout/MobileHeader'
import { web3InboxURLs } from '@/constants/navigation'

import SettingsHeader from '../SettingsHeader'

import './SupportSettings.scss'

const SupportSettings: React.FC = () => {
  return (
    <div className="SupportSettings">
      <SettingsHeader title="Support" />
      <MobileHeader title="Support" back="/settings" />
      <div className="SupportSettings__content">
        <div className="SupportSettings__content__container">
          <Text className="SupportSettings__title" variant="large-600">
            Need help?
          </Text>
          <Text className="SupportSettings__subtitle" variant="paragraph-500">
            Get support at our Discord, or view our{' '}
            <Link to={web3InboxURLs.websiteFaqs}>Frequently Asked Questions</Link>.
          </Text>
          <Link
            to={web3InboxURLs.discord}
            className="SupportSettings__discord-button Button Button__primary Button__medium"
          >
            <DiscordIcon className="SupportSettings__discord-button__icon" />
            <Text variant="small-500">Discord</Text>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SupportSettings
