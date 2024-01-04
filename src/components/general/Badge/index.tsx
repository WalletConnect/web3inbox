import React from 'react'

import Text from '@/components/general/Text'

import './Badge.scss'

interface IBadgeProps {
  children: React.ReactNode
}

const Badge: React.FC<IBadgeProps> = ({ children }) => {
  return (
    <div className="Badge">
      <Text variant="micro-600">{children}</Text>
    </div>
  )
}

export default Badge
