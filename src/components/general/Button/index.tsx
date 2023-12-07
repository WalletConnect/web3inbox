import React from 'react'

import cn from 'classnames'

import Text from '../Text'
import type { TextVariant } from '../Text'

import './Button.scss'

type HTMLButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
type TButtonProps = HTMLButtonProps & {
  customType?: 'action-icon' | 'action' | 'danger' | 'primary'
  size?: 'small' | 'medium'
  textVariant?: TextVariant
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button: React.FC<TButtonProps> = ({
  children,
  disabled,
  onClick,
  className,
  textVariant = 'small-500',
  customType = 'primary',
  leftIcon,
  rightIcon,
  size = 'medium',
  ...props
}) => {
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      className={cn('Button', `Button__${customType} Button__${size}`, className)}
    >
      {leftIcon}
      <Text variant={textVariant}>{children}</Text>
      {rightIcon}
    </button>
  )
}

export default Button
