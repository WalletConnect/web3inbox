import React from 'react'

import { detect } from 'detect-browser'

import BackgroundImage from '@/assets/IntroBackground.png'
import AndroidShareIcon from '@/components/general/Icon/AndroidShare'
import IShareIcon from '@/components/general/Icon/IShare'
import WalletConnectIcon from '@/components/general/Icon/WalletConnectIcon'
import { Modal } from '@/components/general/Modal/Modal'
import Text from '@/components/general/Text'
import { pwaModalService } from '@/utils/store'

import './PwaModal.scss'

export const getMobilePlatformIcon = () => {
  const browser = detect()
  switch (browser?.name) {
    case 'safari':
    case 'ios':
      return <IShareIcon />
    default:
      // Only safari uses the special share icon, rest use standard ellipses
      return <AndroidShareIcon />
  }
}

export const getPlatformInstallText = () => {
  const browser = detect()
  switch (browser?.name) {
    case 'firefox':
    // Firefox on iOS is called Fxios
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox#focus_for_ios
    case 'fxios':
      return 'Install'
    case 'chrome':
    // Chrome on iOS is called Crios
    // https://chromium.googlesource.com/chromium/src.git/+/HEAD/docs/ios/user_agent.md
    case 'crios':
    case 'edge-chromium':
      return 'Install App'
    case 'safari':
    case 'ios':
      return 'Add to homescreen'
    default:
      return 'Install'
  }
}

export const PwaModal: React.FC = () => {
  return (
    <Modal onCloseModal={pwaModalService.closeModal}>
      <div className="PwaModal">
        <div className="PwaModal__background">
          <img src={BackgroundImage} />
        </div>
        <div className="PwaModal__icon">
          <WalletConnectIcon hoverable={false} />
        </div>
        <div className="PwaModal__header">
          <Text variant={'large-500'}>Install Web3Inbox</Text>
        </div>
        <div className="PwaModal__description">
          <Text variant="small-500">
            To receive push notifications and enjoy a  better experience install Web3Inbox on your
            Home screen.
          </Text>
        </div>
        <div className="PwaModal__cta">
          <Text variant="small-500">Just tap </Text>
          <span className="PwaModal__share-icon">{getMobilePlatformIcon()}</span>
          <Text variant="small-500"> and “{getPlatformInstallText()}”</Text>
        </div>
      </div>
    </Modal>
  )
}

export default PwaModal
