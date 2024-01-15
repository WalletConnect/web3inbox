import React from 'react'

import BackgroundImage from '@/assets/IntroBackground.png'
import { Modal } from '@/components/general/Modal/Modal'
import Text from '@/components/general/Text'
import { pwaModalService } from '@/utils/store'

import './ChangeBrowserModal.scss'

export const ChangeBrowserModal: React.FC = () => {
  return (
    <Modal onCloseModal={pwaModalService.closeModal}>
      <div className="ChangeBrowserModal">
        <div className="ChangeBrowserModal__background">
          <img src={BackgroundImage} />
        </div>
        <div className="ChangeBrowserModal__icon">
          <img alt="Web3Inbox icon" className="wc-icon" src="/icon.png" />
        </div>
        <Text variant={'large-500'}>Change Browser</Text>
        <div className="ChangeBrowserModal__content">
          <Text variant="small-500">
            To install the app, you need to add this to your home screen.
          </Text>
          <Text variant="small-500">
            Please open <span>app.web3inbox.com</span> in Safari and follow the instructions.
          </Text>
        </div>
      </div>
    </Modal>
  )
}

export default ChangeBrowserModal
