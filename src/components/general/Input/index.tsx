import React, { forwardRef } from 'react'

import './Input.scss'

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ onChange, value, icon, containerClassName, placeholder, className, ...props }, ref) => {
    return (
      <div className={`Input ${containerClassName ?? ''}`}>
        {icon && <img src={icon} alt="Input Icon" />}
        <input
          ref={ref}
          value={value}
          className={`Input__input ${className ?? ''}`}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      </div>
    )
  }
)

export default Input
