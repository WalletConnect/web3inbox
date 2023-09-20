import React from 'react'
import './Button.scss'
import Text from '../Text'

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
      <Text variant="small-500">{children}</Text>
    </button>
  )
}

export default Button
