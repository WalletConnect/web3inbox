import { useContext, useState } from 'react'

import BackButton from '@/components/general/BackButton'
import Button from '@/components/general/Button'
import Text from '@/components/general/Text'
import W3iContext from '@/contexts/W3iContext/context'
import { noop } from '@/utils/general'
import { useIsMobile } from '@/utils/hooks'

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
  const { dappOrigin } = useContext(W3iContext)
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()

  return (
    <div className="AppNotificationsHeader">
      <div className="AppNotificationsHeader__content">
        {dappOrigin ? (
          <div className="AppNotificationsHeader__plain">
            <h2>Notifications</h2>
            <AppNotificationDropdown
              dropdownPlacement="bottomLeft"
              notificationId={id}
              h="2em"
              w="2em"
              closeDropdown={noop}
            />
          </div>
        ) : (
          <>
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
                <Text variant="link-500" className="AppNotificationsHeader__app__description">
                  {domain}
                </Text>
              </div>
            </div>
            <div className="AppNotificationsHeader__wrapper">
              <AppNotificationDropdown
                closeDropdown={() => setDropdownToShow(undefined)}
                h="2.5em"
                w="2.5em"
                notificationId={id}
                dropdownPlacement="bottomLeft"
              />
            </div>
          </>
        )}
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
