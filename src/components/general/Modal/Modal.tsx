import React, { Fragment, useRef } from 'react'
import { useOnClickOutside } from '../../../utils/hooks'
import './Modal.scss'

interface IModalProps {
  onToggleModal: () => void
  children: React.ReactNode
  width?: string
  height?: string
}
export const Modal: React.FC<IModalProps> = ({ children, onToggleModal, width, height }) => {
  const ref = useRef(null)
  useOnClickOutside(ref, onToggleModal)

  return (
    <Fragment>
      <div className="blur" />
      <div ref={ref} className="modal" style={{ width, height }}>
        <div className="modal__content">{children}</div>
      </div>
    </Fragment>
  )
}
