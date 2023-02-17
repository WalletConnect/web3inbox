import type { ReactNode } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useOnClickOutside } from '../../../utils/hooks'

import Button from '../Button'
import DotsIcon from '../Icon/DotsIcon'
import './Dropdown.scss'

interface IDropdown {
  btnShape?: 'circle' | 'square'
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  w: string
  h: string
  children: ReactNode
}

const Dropdown: React.FC<IDropdown> = ({
  btnShape = 'circle',
  dropdownPlacement = 'bottomRight',
  w,
  h,
  children
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const ref = useRef(null)

  const handleToggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsDropdownOpen(currentState => !currentState)
    },
    [setIsDropdownOpen]
  )

  useOnClickOutside(ref, () => setIsDropdownOpen(currentState => !currentState))

  const dropdownPosition = useMemo(() => {
    const placements = {
      topRight: {
        bottom: 0,
        left: 0,
        marginBottom: `calc(${h} + 0.25em)`
      },
      topLeft: {
        bottom: 0,
        right: 0,
        marginBottom: `calc(${h} + 0.25em)`
      },
      bottomRight: {
        top: 0,
        left: 0,
        marginTop: `calc(${h} + 0.25em)`
      },
      bottomLeft: {
        top: 0,
        right: 0,
        marginTop: `calc(${h} + 0.25em)`
      }
    }

    return placements[dropdownPlacement]
  }, [dropdownPlacement])

  return (
    <div className="Dropdown">
      <Button
        className={`Dropdown__btn${btnShape === 'square' ? '__square' : ''}`}
        style={{ width: w, height: h }}
        onClick={handleToggleDropdown}
        customType="action-icon"
      >
        <DotsIcon />
      </Button>
      {isDropdownOpen && (
        <div ref={ref} className="Dropdown__dropdown" style={dropdownPosition}>
          <div className="Dropdown__dropdown__block">{children}</div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
