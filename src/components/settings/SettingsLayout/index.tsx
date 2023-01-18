import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'

const SettingsLayout: React.FC = () => {
  return (
    <Fragment>
      <div className="TargetSelector"></div>
      <div className="Main">
        <Outlet />
      </div>
    </Fragment>
  )
}

export default SettingsLayout
