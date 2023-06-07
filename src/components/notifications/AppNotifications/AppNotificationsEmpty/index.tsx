import './AppNotificationsEmpty.scss'
import Alarm from '../../../../assets/Alarm.png'

const AppNotificationsEmpty: React.FC = () => {
  return (
    <div className="AppNotificationsEmpty">
      <div className="AppNotificationsEmpty__wrapper">
        <img
          className="AppNotificationsEmpty__icon"
          src={Alarm}
          alt="Notifications Icon"
          loading="lazy"
        />
        <p className="AppNotificationsEmpty__title">No notifications yet</p>
        <p className="AppNotificationsEmpty__subtitle">Notifications will show up here</p>
      </div>
    </div>
  )
}

export default AppNotificationsEmpty
