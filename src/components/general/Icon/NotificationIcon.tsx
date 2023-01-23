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
    <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.0001 0C6.07054 0 3.52589 2.0154 2.8549 4.86708L0.578472 14.5419C0.283081 15.7973 1.23561 17 2.52531 17H15.4749C16.7646 17 17.7171 15.7973 17.4217 14.5419L15.1453 4.86709C14.4743 2.0154 11.9297 0 9.0001 0Z"
        fill={themeColors['--icon-color-1']}
      />
      <path
        d="M12.7231 19.9655C13.0268 19.1947 12.3285 18.5 11.5001 18.5H6.5001C5.67167 18.5 4.97344 19.1947 5.27708 19.9655C5.86177 21.4497 7.30827 22.5 9.0001 22.5C10.6919 22.5 12.1384 21.4497 12.7231 19.9655Z"
        fill={themeColors['--icon-color-1']}
      />
    </svg>
  ) : (
    <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.8549 4.86708C3.52589 2.0154 6.07054 0 9.0001 0C11.9297 0 14.4743 2.0154 15.1453 4.86709L17.4217 14.5419C17.7171 15.7973 16.7646 17 15.4749 17H2.52531C1.23561 17 0.283081 15.7973 0.578472 14.5419L2.8549 4.86708ZM13.6852 5.21064L15.9616 14.8855C16.0355 15.1993 15.7973 15.5 15.4749 15.5H2.52531C2.20288 15.5 1.96475 15.1993 2.0386 14.8855L4.31503 5.21064C4.82659 3.03653 6.76661 1.5 9.0001 1.5C11.2336 1.5 13.1736 3.03653 13.6852 5.21064Z"
        fill={themeColors['--icon-color-1']}
      />
      <path
        d="M11.4508 18.9968C11.2204 20.1395 10.2107 21 9.00011 21C7.78951 21 6.77988 20.1395 6.54948 18.9968C6.4949 18.7261 6.27626 18.5 6.00011 18.5H5.75011C5.3359 18.5 4.99277 18.8389 5.06954 19.2459C5.41899 21.0986 7.04589 22.5 9.00011 22.5C10.9543 22.5 12.5812 21.0986 12.9307 19.2459C13.0075 18.8389 12.6643 18.5 12.2501 18.5H12.0001C11.724 18.5 11.5053 18.7261 11.4508 18.9968Z"
        fill={themeColors['--icon-color-1']}
      />
    </svg>
  )
}

export default NotificationIcon
