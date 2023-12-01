import React, { useContext } from 'react'

import SettingsContext from '@/contexts/SettingsContext/context'
import { useColorModeValue } from '@/utils/hooks'

interface TMessageIconProps {
  isFilled?: boolean
}
const MessageIcon: React.FC<TMessageIconProps> = ({ isFilled = false }) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return isFilled ? (
    <svg fill="none" width="24" height="24" viewBox="0 0 24 24">
      <path
        fill={themeColors['--icon-color-1']}
        d="M21 12a9 9 0 0 1-12.38 8.34c-.2-.08-.3-.12-.39-.14a.9.9 0 0 0-.21-.02l-.36.04-3.56.6c-.37.06-.55.09-.69.03a.5.5 0 0 1-.26-.26c-.06-.14-.03-.32.03-.7l.6-3.55.04-.36a.9.9 0 0 0-.02-.21c-.02-.09-.06-.19-.14-.39A9 9 0 1 1 21 12Z"
      />
    </svg>
  ) : (
    <svg fill="none" width="24" height="24" viewBox="0 0 24 24">
      <path
        stroke="#798686"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M21 12a9 9 0 0 1-12.38 8.34c-.2-.08-.3-.12-.39-.14a.9.9 0 0 0-.21-.02l-.36.04-3.56.6c-.37.06-.55.09-.69.03a.5.5 0 0 1-.26-.26c-.06-.14-.03-.32.03-.7l.6-3.55.04-.36a.9.9 0 0 0-.02-.21c-.02-.09-.06-.19-.14-.39A9 9 0 1 1 21 12Z"
      />
    </svg>
  )
}

export default MessageIcon
