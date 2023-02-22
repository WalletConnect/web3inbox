import { useIsMobile } from '../../../../utils/hooks'
import BackButton from '../../../general/BackButton'
import Button from '../../../general/Button'
import Select from '../../../general/Select/Select'
import './AppNotificationsHeader.scss'

interface IAppNotificationsHeaderProps {
  id: string
  logo: string
  name: string
}
const AppNotificationsHeader: React.FC<IAppNotificationsHeaderProps> = ({ logo, name }) => {
  const isMobile = useIsMobile()

  return (
    <div className="AppNotificationsHeader">
      <div className="AppNotificationsHeader__content">
        <div className="AppNotificationsHeader__app">
          <BackButton backTo="/notifications" />
          <img
            className="AppNotificationsHeader__app__logo"
            src={logo}
            alt={`${name}logo`}
            loading="lazy"
          />
          <h2 className="AppNotificationsHeader__app__name">{name}</h2>
        </div>
      </div>

      {isMobile && (
        <div className="AppNotificationsHeader__secondary__actions">
          <Select
            id="notification-selector"
            name="notification-selector"
            onChange={console.log}
            options={[{ label: 'All', value: 'all' }]}
          />
          <Button customType="action">Unread</Button>
        </div>
      )}
    </div>
  )
}

export default AppNotificationsHeader
