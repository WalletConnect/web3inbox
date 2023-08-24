import React, { useContext } from 'react'
import SettingsContext from '../../../contexts/SettingsContext/context'
import { useColorModeValue } from '../../../utils/hooks'

interface TNotificationIconProps {
  isFilled?: boolean
}
const NotificationIcon: React.FC<TNotificationIconProps> = ({ isFilled = false }) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return isFilled ? (
    <svg fill="none" width="24" height="24" viewBox="0 0 24 24">
      <path
        fill={themeColors['--icon-color-1']}
        d="M2 13.5c0-.83.67-1.5 1.5-1.5h1.88c.4 0 .78.16 1.06.44l1.12 1.12c.28.28.66.44 1.06.44h6.13c.47 0 .92-.22 1.2-.6l.6-.8c.28-.38.73-.6 1.2-.6h2.75c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-5Z"
      />
      <path
        stroke={themeColors['--icon-color-1']}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.5 12h3.38c.69 0 1.31.39 1.62 1 .3.61.93 1 1.62 1h5.76a1.8 1.8 0 0 0 1.62-1c.3-.61.93-1 1.62-1h3.38M8.97 4h6.06c1.08 0 1.62 0 2.1.16a3 3 0 0 1 1.12.7c.35.35.6.83 1.08 1.8l2.16 4.33c.2.37.29.56.35.76a3 3 0 0 1 .13.54c.03.2.03.42.03.84v2.07c0 1.68 0 2.52-.33 3.16a3 3 0 0 1-1.3 1.31c-.65.33-1.49.33-3.17.33H6.8c-1.68 0-2.52 0-3.16-.33a3 3 0 0 1-1.31-1.3C2 17.71 2 16.87 2 15.2v-2.07c0-.42 0-.63.03-.84a3 3 0 0 1 .13-.54c.06-.2.16-.39.35-.76l2.16-4.34a6.7 6.7 0 0 1 1.08-1.8 3 3 0 0 1 1.13-.69C7.35 4 7.89 4 8.97 4Z"
      />
    </svg>
  ) : (
    <svg fill="none" width="24" height="24" viewBox="0 0 24 24">
      <path
        stroke="#798686"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.5 12h3.38c.69 0 1.31.39 1.62 1 .3.61.93 1 1.62 1h5.76a1.8 1.8 0 0 0 1.62-1c.3-.61.93-1 1.62-1h3.38M8.97 4h6.06c1.08 0 1.62 0 2.1.16a3 3 0 0 1 1.12.7c.35.35.6.83 1.08 1.8l2.16 4.33c.2.37.29.56.35.76a3 3 0 0 1 .13.54c.03.2.03.42.03.84v2.07c0 1.68 0 2.52-.33 3.16a3 3 0 0 1-1.3 1.31c-.65.33-1.49.33-3.17.33H6.8c-1.68 0-2.52 0-3.16-.33a3 3 0 0 1-1.31-1.3C2 17.71 2 16.87 2 15.2v-2.07c0-.42 0-.63.03-.84a3 3 0 0 1 .13-.54c.06-.2.16-.39.35-.76l2.16-4.34a6.7 6.7 0 0 1 1.08-1.8 3 3 0 0 1 1.13-.69C7.35 4 7.89 4 8.97 4Z"
      />
    </svg>
  )
}

export default NotificationIcon
