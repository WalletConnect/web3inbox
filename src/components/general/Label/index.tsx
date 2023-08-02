import React from 'react'
import './Label.scss'
import Text from '../Text'

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
