import React from 'react'
import './Button.scss'

interface ButtonProps {
  type?: 'action-icon' | 'action' | 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  className,
  type = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`Button Button__${type} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}

export default Button
