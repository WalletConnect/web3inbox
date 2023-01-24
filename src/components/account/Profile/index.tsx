import React from 'react'
import { profileModalService } from '../../../utils/store'
import { Modal } from '../../general/Modal/Modal'

export const Profile: React.FC = () => {
  return (
    <Modal onToggleModal={profileModalService.toggleModal}>
      <h1>Profile modal content</h1>
    </Modal>
  )
}
