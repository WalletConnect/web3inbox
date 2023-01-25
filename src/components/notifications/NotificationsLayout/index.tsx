import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import AppSelector from '../AppSelector'

const NotificationsLayout: React.FC = () => {
  return (
    <Fragment>
      <div className="TargetSelector">
        <AppSelector />
      </div>
      <div className="Main">
        <Outlet />
      </div>
    </Fragment>
  )
}

export default NotificationsLayout
