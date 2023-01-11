import React from 'react'
import './Button.scss'

interface ButtonProps {
  type?: 'primary' | 'secondary'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ children, disabled, onClick, type = 'primary' }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={`Button Button__${type}`}>
      {children}
    </button>
  )
}

export default Button
