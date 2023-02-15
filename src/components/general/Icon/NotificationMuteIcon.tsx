import React, { useContext } from 'react'
import SettingsContext from '../../../contexts/SettingsContext/context'
import { useColorModeValue } from '../../../utils/hooks'

interface INotificationMuteIcon {
  fillColor?: string
}

const NotificationMuteIcon: React.FC<INotificationMuteIcon> = ({ fillColor }) => {
  const { mode } = useContext(SettingsContext)
  const themeColors = useColorModeValue(mode)

  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.15278 4.4087C3.64875 2.12727 5.66778 0.5 8.0025 0.5C9.15908 0.5 10.2382 0.89934 11.093 1.57972C11.4622 1.87349 11.3698 2.42739 10.9612 2.66313L10.9054 2.69532C10.6151 2.86281 10.2533 2.81001 9.97804 2.61874C9.41345 2.2264 8.72994 2 8.0025 2C6.37342 2 4.96461 3.13545 4.61855 4.72734L4.31612 6.11853C4.25623 6.39401 4.08285 6.63141 3.83866 6.77229L3.44532 6.99922C3.06943 7.21608 2.61468 6.88397 2.70687 6.45991L3.15278 4.4087Z"
        fill={fillColor ?? themeColors['--icon-color-1']}
      />
      <path
        d="M12.0804 7.91949C11.9976 7.53854 12.1706 7.14775 12.5082 6.95294C12.9025 6.72547 13.4041 6.94751 13.5008 7.39231L13.9754 9.57514C14.2464 10.8217 13.2967 12 12.021 12H4.84831C4.59773 12 4.50296 11.6724 4.71485 11.5386L6.11542 10.6544C6.2752 10.5535 6.46029 10.5 6.64925 10.5H12.021C12.3399 10.5 12.5773 10.2054 12.5096 9.89379L12.0804 7.91949Z"
        fill={fillColor ?? themeColors['--icon-color-1']}
      />
      <path
        d="M8.0025 15C8.65899 15 9.21698 14.5783 9.42032 13.9909C9.51066 13.73 9.72636 13.5 10.0025 13.5H10.2525C10.6667 13.5 11.0121 13.841 10.9099 14.2424C10.5795 15.5402 9.40311 16.5 8.0025 16.5C6.60189 16.5 5.42546 15.5402 5.09507 14.2424C4.99288 13.841 5.33829 13.5 5.7525 13.5H6.0025C6.27864 13.5 6.49434 13.73 6.58469 13.9909C6.78803 14.5783 7.34601 15 8.0025 15Z"
        fill={fillColor ?? themeColors['--icon-color-1']}
      />
      <path
        d="M13.7275 4.52442C14.0863 4.31743 14.2094 3.85875 14.0024 3.49996C13.7954 3.14119 13.3368 3.01814 12.978 3.22512L2.27281 9.4008C1.91401 9.60779 1.79095 10.0665 1.99796 10.4253C2.20495 10.784 2.66358 10.9071 3.02236 10.7001L13.7275 4.52442Z"
        fill={fillColor ?? themeColors['--icon-color-1']}
      />
    </svg>
  )
}

export default NotificationMuteIcon
