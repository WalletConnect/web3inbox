import React from 'react'

import './Toggle.scss'

interface ToggleProps {
  name: string
  id: string
  checked: boolean
  setChecked: (isChecked: boolean) => void
}

const Toggle: React.FC<ToggleProps> = ({ name, id, setChecked, checked }) => {
  return (
    <div className="Toggle">
      <input
        checked={checked}
        onChange={ev => setChecked(ev.target.checked)}
        type="checkbox"
        className="Toggle__checkbox"
        name={name}
        id={id}
      />
      <label className="Toggle__label" htmlFor={id}>
        <span className="Toggle__inner" />
        <span className="Toggle__switch" />
      </label>
    </div>
  )
}

export default Toggle
