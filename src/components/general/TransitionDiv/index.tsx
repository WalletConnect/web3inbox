import React from 'react'

import type { HTMLMotionProps } from 'framer-motion'
// eslint-disable-next-line no-duplicate-imports
import { LazyMotion, domAnimation, m } from 'framer-motion'

interface ITransitionDivProps extends HTMLMotionProps<'div'> {
  ref?: React.RefObject<HTMLDivElement>
}

const TransitionDiv: React.FC<ITransitionDivProps> = ({ children, ...props }) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.1 }}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

export default TransitionDiv
