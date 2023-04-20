import React, { Fragment, useRef, useCallback } from 'react'
import { useOnClickOutside, useResizeObserver } from '../../../utils/hooks'
import './Modal.scss'
import { LazyMotion, domMax, m } from 'framer-motion'

interface IModalProps {
  onToggleModal: () => void
  children: React.ReactNode
  width?: string
  height?: string
}
export const Modal: React.FC<IModalProps> = ({ children, onToggleModal, width, height }) => {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onToggleModal)

  const onResize = useCallback((target: HTMLDivElement) => {
    if (ref.current) {
      ref.current.style.height = `${target.offsetHeight}px`
    }
  }, [])

  const contentRef = useResizeObserver(onResize)

  return (
    <LazyMotion features={domMax}>
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
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          ref={ref}
          className="modal"
          style={{ width, height }}
        >
          <m.div
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            ref={contentRef}
            className="modal__content"
          >
            {children}
          </m.div>
        </m.div>
      </Fragment>
    </LazyMotion>
  )
}
