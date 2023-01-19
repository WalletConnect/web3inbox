import React from 'react'
import './Radio.scss'

interface RadioProps {
  label: string
  name: string
  checked: boolean
  onCheck: (name: string) => void
  id: string
}

const Radio: React.FC<RadioProps> = ({ label, checked, onCheck, name, id }) => {
  return (
    <div className="Radio">
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
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default Radio
