import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import SettingsSelector from '../SettingsSelector'

const SettingsLayout: React.FC = () => {
  return (
    <Fragment>
      <div className="TargetSelector">
        <SettingsSelector />
      </div>
      <div className="Main">
        <Outlet />
      </div>
    </Fragment>
  )
}

export default SettingsLayout
