import React from 'react'
import './Radio.scss'

interface RadioProps {
  label: string
  name: string
  id: string
}

const Radio: React.FC<RadioProps> = ({ label, name, id }) => {
  return (
    <div className="Radio">
      <input type="radio" name={name} id={id} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default Radio
