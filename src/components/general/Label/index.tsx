import React from 'react'

import Text from '../Text'

import './Label.scss'

interface ILabelProps {
  children: React.ReactNode | React.ReactNode[]
  color: 'accent' | 'main'
}

const Label: React.FC<ILabelProps> = ({ children, color }) => {
  return (
    <span className={`Label Label__${color}`}>
      <Text variant="micro-700">{children}</Text>
    </span>
  )
}

export default Label
