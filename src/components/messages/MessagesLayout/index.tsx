import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import ThreadSelector from '../ThreadSelector'

interface MessagesLayoutProps {}

const MessagesLayout: React.FC<MessagesLayoutProps> = props => {
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
