import React, { useContext } from 'react'

import SettingsContext from '@/contexts/SettingsContext/context'
import { useColorModeValue } from '@/utils/hooks'

const DotsIcon: React.FC = () => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return (
    <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.895431 0.89543 0 2 0C3.10457 0 4 0.895431 4 2Z"
        fill={themeColors['--icon-color-1']}
      />
      <path
        d="M10 2C10 3.10457 9.10457 4 8 4C6.89543 4 6 3.10457 6 2C6 0.895431 6.89543 0 8 0C9.10457 0 10 0.895431 10 2Z"
        fill={themeColors['--icon-color-1']}
      />
      <path
        d="M14 4C15.1046 4 16 3.10457 16 2C16 0.895431 15.1046 0 14 0C12.8954 0 12 0.895431 12 2C12 3.10457 12.8954 4 14 4Z"
        fill={themeColors['--icon-color-1']}
      />
    </svg>
  )
}

export default DotsIcon
