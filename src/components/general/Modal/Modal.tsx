import React, { Fragment, useRef, useCallback } from 'react'
import { useOnClickOutside, useResizeObserver } from '@/utils/hooks'
import { LazyMotion, domMax, m } from 'framer-motion'
import './Modal.scss'

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
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overlay"
        />
        <m.div
          initial={{ opacity: 0, y: '-50%', x: '-50%', scale: 0.95 }}
          animate={{ opacity: 1, y: '-50%', x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: '-50%', x: '-50%', scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          ref={ref}
          className="modal"
          style={{ width, height }}
        >
          <div ref={contentRef} className="modal__content">
            {children}
          </div>
        </m.div>
      </Fragment>
    </LazyMotion>
  )
}
