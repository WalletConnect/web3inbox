import { useParams } from 'react-router-dom'
import { myAppsMock } from '../AppSelector'
import AppNotificationItem from './AppNotificationItem'
import './AppNotifications.scss'
import AppNotificationsHeader from './AppNotificationsHeader'

const AppNotifications = () => {
  const { appId } = useParams()
  const app = myAppsMock.find(mock => mock.id === appId)

  return app ? (
    <div className="AppNotifications">
      <AppNotificationsHeader id={app.id} name={app.name} logo={app.logo} />
      {app.notifications?.map(notification => (
        <AppNotificationItem key={notification.id} notification={notification} appLogo={app.logo} />
      ))}
    </div>
  ) : (
    <div>404</div>
  )
}

export default AppNotifications
