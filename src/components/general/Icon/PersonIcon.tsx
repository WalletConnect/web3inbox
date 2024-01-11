import React, { useContext } from 'react'

import SettingsContext from '@/contexts/SettingsContext/context'
import { useColorModeValue } from '@/utils/hooks'

const PersonIcon: React.FC = () => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return (
    <svg width="16" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5002 4.5C10.5002 7 9.00018 9.5 6.00018 9.5C3.00018 9.5 1.50018 7 1.50018 4.5C1.50018 2.5 3.00018 0 6.00018 0C9.00018 0 10.5002 2.5 10.5002 4.5ZM9.00018 4.5C9.00018 5.47034 8.70592 6.37291 8.20388 7.00046C7.73235 7.58988 7.03468 8 6.00018 8C4.96568 8 4.26802 7.58988 3.79649 7.00046C3.29445 6.37291 3.00018 5.47034 3.00018 4.5C3.00018 3.10317 4.03721 1.5 6.00018 1.5C7.96316 1.5 9.00018 3.10317 9.00018 4.5Z"
        fill={themeColors['--fg-color-1']}
      />
      <path
        d="M11.9338 15.2538C11.5015 12.8463 9.00958 11 6.00019 11C2.99079 11 0.498865 12.8463 0.0665558 15.2538C-0.00665322 15.6615 0.335972 16 0.750185 16C1.1644 16 1.49258 15.6581 1.60901 15.2606C2.03026 13.8224 3.64805 12.5 6.00019 12.5C8.35232 12.5 9.97011 13.8224 10.3914 15.2606C10.5078 15.6581 10.836 16 11.2502 16C11.6644 16 12.007 15.6615 11.9338 15.2538Z"
        fill={themeColors['--fg-color-1']}
      />
    </svg>
  )
}

export default PersonIcon
