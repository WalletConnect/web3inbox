import React from 'react'
import ArrowRightIcon from '../Icon/ArrowRightIcon'
import './Select.scss'

interface ISelectProps {
  name: string
  id: string
  options: {
    label: string
    value: string
  }[]
  onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined
}

const Select: React.FC<ISelectProps> = ({ name, id, options, onChange }) => {
  return (
    <select name={name} id={id} onChange={onChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}

export default Select
