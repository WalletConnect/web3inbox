import React from 'react'
import './Text.scss'

interface ITextProps {
  children: React.ReactNode
  variant:
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
}

const Text: React.FC<ITextProps> = ({ children, variant }) => {
  return <span className={`Text Text__${variant}`}>{children}</span>
}

export default Text
