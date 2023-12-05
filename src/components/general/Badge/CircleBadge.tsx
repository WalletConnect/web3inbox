import React from 'react'

import './CircleBadge.scss'

interface CircleBadgeProps {
  children: React.ReactNode
}

const CircleBadge: React.FC<CircleBadgeProps> = ({ children }) => {
  return (
    <div className="Circle-badge">
      <div className="Circle-badge__content">{children}</div>
    </div>
  )
}

export default CircleBadge
