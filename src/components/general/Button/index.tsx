import React from 'react'
import './Button.scss'

interface ButtonProps {
  type?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'primary' }) => {
  return (
    <button onClick={onClick} className={`Button Button__${type}`}>
      {children}
    </button>
  )
}

export default Button
