import React from 'react'
import { Modal } from '../../general/Modal/Modal'
import { pwaModalService } from '../../../utils/store'
import BackgroundImage from '../../../assets/IntroBackground.png'
import WalletConnectIcon from '../../general/Icon/WalletConnectIcon'
import './PwaModal.scss'
import Text from '../../general/Text'

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
        <div className="PwaModal_cta">
          <Text variant="small-500">Just tap settings and “Add to Home Screen”</Text>
        </div>
      </div>
    </Modal>
  )
}

export default PwaModal
