import type { ReactNode } from 'react'
import React from 'react'
import './MobileHeader.scss'

interface IMobileHeaderProps {
  children: ReactNode
}
const MobileHeader: React.FC<IMobileHeaderProps> = ({ children }) => {
  return <h1 className="MobileHeader">{children}</h1>
}

export default MobileHeader
