import React from 'react'

import cn from 'classnames'

import Text from '@/components/general/Text'

import './Badge.scss'

interface IBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
}

const Badge: React.FC<IBadgeProps> = ({ children, variant = 'default' }) => {
  return (
    <div className={cn('Badge', variant)}>
      <Text variant="micro-600">{children}</Text>
    </div>
  )
}

export default Badge
