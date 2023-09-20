import './AppNotificationsEmpty.scss'

import Text from '../../../general/Text'
import { useEffect, useRef } from 'react'

const AppNotificationsEmpty: React.FC<{ icon: string; name: string }> = ({ icon, name }) => {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.style.setProperty('--local-bg-url', `url(${icon})`)
    }
  }, [icon])

  return (
    <div className="AppNotificationsEmpty">
      <div className="AppNotificationsEmpty__wrapper">
        <div className="AppNotificationsEmpty__visual">
          <div className="AppNotificationsEmpty__visual__item">
            <img
              className="AppNotificationsEmpty__visual__item__logo"
              src={icon}
              alt={`${name} logo`}
            />
            <div className="AppNotificationsEmpty__visual__item__container">
              <div className="AppNotificationsEmpty__visual__item__skeleton"></div>
              <div className="AppNotificationsEmpty__visual__item__skeleton"></div>
            </div>
          </div>
        </div>
        <div className="AppNotificationsEmpty__visual__medium"></div>
        <div className="AppNotificationsEmpty__visual__small"></div>
        <div ref={backgroundRef} className="AppNotificationsEmpty__visual__background"></div>
        <Text className="AppNotificationsEmpty__title" variant="large-600">
          You’re ready to go
        </Text>
        <Text className="AppNotificationsEmpty__subtitle" variant="small-500">
          Notifications will show up here
        </Text>
      </div>
    </div>
  )
}

export default AppNotificationsEmpty
