import React from 'react'
import { shareModalService } from '../../../utils/store'
import { Modal } from '../../general/Modal/Modal'

export const Share: React.FC = () => {
  return (
    <Modal onToggleModal={shareModalService.toggleModal}>
      <h1>Share modal content</h1>
    </Modal>
  )
}
