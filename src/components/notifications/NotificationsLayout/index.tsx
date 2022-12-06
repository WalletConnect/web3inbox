import React, { Fragment } from 'react'

interface NotificationsLayoutProps {}

const NotificationsLayout: React.FC<NotificationsLayoutProps> = props => {
  return (
    <Fragment>
      <div className="TargetSelector">Notifications Target selector</div>
      <div className="Main">Notifications Main</div>
    </Fragment>
  )
}

export default NotificationsLayout
