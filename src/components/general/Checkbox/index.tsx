import React, { useCallback } from 'react'
import './Checkbox.scss'

interface CheckboxProps {
  name: string
  id: number | string
  checked: boolean
  onCheck?: () => void
  onUncheck?: () => void
}

const Checkbox: React.FC<CheckboxProps> = ({ name, checked, id, onCheck, onUncheck }) => {
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      console.log({ evChecked: ev.target.checked })
      if (ev.target.checked && onCheck) {
        console.log('Calling onCheck')
        onCheck()
      }
      if (!ev.target.checked && onUncheck) {
        console.log('Calling onUnCheck')
        onUncheck()
      }
    },
    [onCheck, onUncheck]
  )

  return (
    <div className="Checkbox">
      <input
        checked={checked}
        onChange={handleChange}
        type="checkbox"
        name={name}
        id={id.toString()}
      />
    </div>
  )
}

export default Checkbox
