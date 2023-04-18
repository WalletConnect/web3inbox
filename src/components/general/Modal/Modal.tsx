import React, { Fragment, useRef } from 'react'
import { useOnClickOutside } from '../../../utils/hooks'
import './Modal.scss'
import { LazyMotion, domAnimation, m } from 'framer-motion'

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
    <LazyMotion features={domAnimation}>
      <Fragment>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: 'easeInOut' }}
          className="blur"
        />
        <m.div
          initial={{ opacity: 0, y: '-45%', x: '-50%' }}
          animate={{ opacity: 1, y: '-50%', x: '-50%' }}
          exit={{ opacity: 0, y: '-45%', x: '-50%' }}
          transition={{ duration: 0.1, ease: 'easeInOut' }}
          ref={ref}
          className="modal"
          style={{ width, height }}
        >
          <div className="modal__content">{children}</div>
        </m.div>
      </Fragment>
    </LazyMotion>
  )
}
