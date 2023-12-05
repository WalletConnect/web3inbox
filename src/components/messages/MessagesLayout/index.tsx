import React, { Fragment } from 'react'

import { Outlet } from 'react-router-dom'

import ThreadSelector from '../ThreadSelector'

const MessagesLayout: React.FC = () => {
  return (
    <Fragment>
      <div className="TargetSelector">
        <ThreadSelector />
      </div>
      <div className="Main">
        <Outlet />
      </div>
    </Fragment>
  )
}

export default MessagesLayout
