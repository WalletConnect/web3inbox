import { useEffect, useRef } from 'react'

import Text from '@/components/general/Text'

import './AppNotificationsEmpty.scss'

interface IAppNotificationsEmptyProps {
  icon: string | undefined
  name: string
}

const AppNotificationsEmpty: React.FC<IAppNotificationsEmptyProps> = ({ icon, name }) => {
  const backgroundRef = useRef<HTMLDivElement>(null)

  const iconURL = icon || '/fallback.svg'

  useEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.style.setProperty('--local-bg-url', `url(${iconURL})`)
    }
  }, [iconURL])

  return (
    <div className="AppNotificationsEmpty">
      <div className="AppNotificationsEmpty__wrapper">
        <div className="AppNotificationsEmpty__visual">
          <div className="AppNotificationsEmpty__visual__item">
            <img
              className="AppNotificationsEmpty__visual__item__logo"
              alt={`${name} logo`}
              src={iconURL}
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
