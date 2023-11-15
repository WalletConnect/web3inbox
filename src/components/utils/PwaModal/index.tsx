import React from 'react'
import { Modal } from '../../general/Modal/Modal'
import { pwaModalService } from '../../../utils/store'
import BackgroundImage from '../../../assets/IntroBackground.png'
import WalletConnectIcon from '../../general/Icon/WalletConnectIcon'
import './PwaModal.scss'
import Text from '../../general/Text'
import AndroidShareIcon from '../../../components/general/Icon/AndroidShare'
import IShareIcon from '../../../components/general/Icon/IShare'
import { getMobilePlatform } from '../../../utils/pwa'

export const getMobilePlatformIcon = () => {
  switch (getMobilePlatform()) {
    case 'ios':
      return <IShareIcon />
    case 'android':
    default:
      return <AndroidShareIcon />
  }
}

export const getPlatformInstallText = () => {
  
}

export const PwaModal: React.FC = () => {
  return (
    <Modal onToggleModal={pwaModalService.toggleModal}>
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
          <Text variant="small-500"> and “Add to Home Screen”</Text>
        </div>
      </div>
    </Modal>
  )
}

export default PwaModal
