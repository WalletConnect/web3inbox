import React from 'react'

import cn from 'classnames'

import './Text.scss'

export type TextVariant =
  | 'large-500'
  | 'large-600'
  | 'large-700'
  | 'link-500'
  | 'link-600'
  | 'link-700'
  | 'micro-600'
  | 'micro-700'
  | 'paragraph-500'
  | 'paragraph-600'
  | 'paragraph-700'
  | 'small-400'
  | 'small-500'
  | 'small-600'
  | 'small-700'
  | 'tiny-500'
  | 'tiny-600'

interface ITextProps {
  children: React.ReactNode
  variant: TextVariant
  className?: string
}

const Text = React.forwardRef<HTMLSpanElement, ITextProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <span className={cn('Text', `Text__${variant}`, className)} ref={ref} {...props}>
        {children}
      </span>
    )
  }
)

export default Text
