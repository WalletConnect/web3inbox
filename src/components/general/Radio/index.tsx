import React from 'react'

import Text from '../Text'

import './Radio.scss'

interface RadioProps {
  label: string
  name: string
  checked: boolean
  onCheck: (name: string) => void
  id: string
  description?: string
  icon: React.ReactNode
}

const Radio: React.FC<RadioProps> = ({ label, checked, onCheck, name, id, description, icon }) => {
  return (
    <div className="Radio">
      <label htmlFor={id}>
        {icon}
        <div className="Radio__wrapper">
          <p className="Radio__wrapper__title">{label}</p>
          {description && (
            <Text variant="small-500" className="Radio__wrapper__description">
              {description}
            </Text>
          )}
        </div>
      </label>
      <input
        checked={checked}
        onChange={ev => {
          if (ev.currentTarget.checked) {
            onCheck(name)
          }
        }}
        type="radio"
        name={name}
        id={id}
      />
    </div>
  )
}

export default Radio
