import type { ReactNode } from 'react'
import React, { useMemo } from 'react'
import type { IIconWrapper } from '../../../../utils/types'
import './IconWrapper.scss'

interface IIconWrapperProps extends IIconWrapper {
  children: ReactNode
  width?: string
  height?: string
}

const IconWrapper: React.FC<IIconWrapperProps> = ({ children, shape, width, height, bgColor }) => {
  const backgroundColor = useMemo(() => {
    if (!bgColor) {
      return 'none'
    }
    const colors = {
      pink: '#E87DE8',
      blue: '#1AC6FF',
      purple: '#987DE8',
      orange: '#FF974C',
      green: '#2BEE6C',
      nightBlue: '#516DFB',
      turquoise: '#36E2E2'
    }

    return colors[bgColor]
  }, [bgColor])

  return (
    <div className={`IconWrapper IconWrapper__${shape}`} style={{ width, height, backgroundColor }}>
      <div
        className={`IconWrapper__overlay IconWrapper__overlay__${shape}`}
        style={{
          boxShadow: backgroundColor === 'none' ? 'none' : `inset 0px 0px 10px ${backgroundColor}`
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default IconWrapper
