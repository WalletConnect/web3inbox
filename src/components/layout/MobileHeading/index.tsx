import type { ReactNode } from 'react'
import React from 'react'

import './MobileHeading.scss'

interface IMobileHeadingProps {
  children: ReactNode
  size?: 'medium' | 'small'
}
const MobileHeading: React.FC<IMobileHeadingProps> = ({ children, size }) => {
  return (
    <h1 className={size ? `MobileHeading MobileHeading__${size}` : 'MobileHeading'}>{children}</h1>
  )
}

export default MobileHeading
