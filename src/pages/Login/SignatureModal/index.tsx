import React from 'react'
import { Modal } from '../../../components/general/Modal/Modal'
import { signatureModalService } from '../../../utils/store'
import './SignatureModal.scss'

export const SignatureModal: React.FC = () => {
  return (
    <Modal onToggleModal={signatureModalService.toggleModal}>
      <div className="SignatureModal">
        <div className="SignatureModal__header">
          <h2>Signature requested</h2>
        </div>
        <div className="SignatureModal__content">
          <div className="SignatureModal__content__title">
            Please sign the message on your wallet.
          </div>
        </div>
      </div>
    </Modal>
  )
}
