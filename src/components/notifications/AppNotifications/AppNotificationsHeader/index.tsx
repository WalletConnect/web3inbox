import { Link } from 'react-router-dom'

import BackButton from '@/components/general/BackButton'
import Button from '@/components/general/Button'
import ArrowRightTopIcon from '@/components/general/Icon/ArrowRightTopIcon'
import Text from '@/components/general/Text'
import { noop } from '@/utils/general'
import { useIsMobile } from '@/utils/hooks'
import getDomainHref from '@/utils/url'

import AppNotificationDropdown from '../AppNotificationDropdown'

import './AppNotificationsHeader.scss'

interface IAppNotificationsHeaderProps {
  id: string
  logo: string | undefined
  name: string
  domain: string
}

const AppNotificationsHeader: React.FC<IAppNotificationsHeaderProps> = ({
  domain,
  logo,
  name,
  id
}) => {
  const isMobile = useIsMobile()
  const href = getDomainHref(domain)

  return (
    <div className="AppNotificationsHeader">
      <div className="AppNotificationsHeader__content">
        <div className="AppNotificationsHeader__app">
          <BackButton backTo="/notifications" />
          <img
            className="AppNotificationsHeader__app__logo"
            src={logo || '/fallback.svg'}
            alt={`${name} logo`}
            loading="lazy"
          />
          <div className="AppNotificationsHeader__app__name_container">
            <h2 className="AppNotificationsHeader__app__name">{name}</h2>
            <Link
              to={href}
              className="AppNotificationsHeader__app__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text variant="link-500">{domain}</Text>
              <div>
                <ArrowRightTopIcon />
              </div>
            </Link>
          </div>
        </div>
        <div className="AppNotificationsHeader__wrapper">
          <AppNotificationDropdown
            h="2.5em"
            w="2.5em"
            notificationId={id}
            dropdownPlacement="bottomLeft"
            closeDropdown={noop}
          />
        </div>
      </div>

      {isMobile && (
        <div className="AppNotificationsHeader__secondary__actions">
          <Button customType="action">All</Button>
          <Button customType="action">Unread</Button>
        </div>
      )}
    </div>
  )
}

export default AppNotificationsHeader
