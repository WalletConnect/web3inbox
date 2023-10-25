import { useContext, useState } from 'react'
import W3iContext from '../../../../contexts/W3iContext/context'
import { noop } from '../../../../utils/general'
import { useIsMobile } from '../../../../utils/hooks'
import BackButton from '../../../general/BackButton'
import Button from '../../../general/Button'
import AppNotificationDropdown from '../AppNotificationDropdown'
import './AppNotificationsHeader.scss'
import { handleImageFallback } from '../../../../utils/ui'

interface IAppNotificationsHeaderProps {
  id: string
  logo: string
  name: string
}
const AppNotificationsHeader: React.FC<IAppNotificationsHeaderProps> = ({ logo, name, id }) => {
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
                src={logo}
                onError={handleImageFallback}
                alt={`${name}logo`}
                loading="lazy"
              />
              <h2 className="AppNotificationsHeader__app__name">{name}</h2>
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
