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
      if (ev.target.checked && onCheck) {
        onCheck()
      }
      if (!ev.target.checked && onUncheck) {
        onUncheck()
      }
    },
    [onCheck, onUncheck]
  )

  return (
    <div className="Checkbox">
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden'
        }}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 15 14"
      >
        <clipPath id="checkmark" clipPathUnits="objectBoundingBox" transform="scale(0.07, 0.07)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.6552 1.13212C13.0052 1.35375 13.1092 1.81709 12.8875 2.16703L6.32115 12.535C5.95375 13.1151 5.12441 13.1609 4.69546 12.6247L1.16438 8.21082C0.905619 7.88737 0.95806 7.4154 1.28151 7.15665C1.60495 6.89789 2.07692 6.95033 2.33568 7.27378L5.21001 10.8667C5.31724 11.0007 5.52458 10.9893 5.61643 10.8443L11.6203 1.36445C11.8419 1.01451 12.3053 0.910496 12.6552 1.13212Z"
            fill="currentcolor"
          />
          <path
            d="M11.1979 1.09692L11.6203 1.36445L11.1979 1.09692L5.38152 10.2807L2.72611 6.96143C2.29485 6.42235 1.50824 6.33495 0.969159 6.76621C0.430081 7.19747 0.34268 7.98409 0.773942 8.52317L4.30502 12.937C4.94845 13.7413 6.19246 13.6727 6.74356 12.8026L13.31 2.43455L12.8875 2.16703L13.31 2.43455C13.6793 1.85133 13.506 1.07909 12.9227 0.709713C12.3395 0.340336 11.5673 0.513696 11.1979 1.09692ZM5.60044 10.5543L5.60016 10.554L5.60044 10.5543Z"
            stroke="currentcolor"
            strokeOpacity="0.1"
            strokeLinecap="round"
          />
        </clipPath>
      </svg>
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
