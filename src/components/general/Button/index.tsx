import React from 'react'
import './Button.scss'

type THTMLButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
type TButtonProps = THTMLButtonProps & {
  customType?: 'action-icon' | 'action' | 'danger' | 'primary' | 'secondary'
}

const Button: React.FC<TButtonProps> = ({
  children,
  disabled,
  onClick,
  className,
  customType = 'primary',
  ...props
}) => {
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      className={`Button Button__${customType} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}

export default Button
