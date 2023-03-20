import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import { useIsMobile } from '../../../utils/hooks'

const SettingsLayout: React.FC = () => {
  const isMobile = useIsMobile()

  return (
    <Fragment>
      <div
        className="Main"
        style={{
          display: 'block',
          gridArea: isMobile
            ? 'target-selector'
            : 'target-selector / target-selector / target-selector / main'
        }}
      >
        <Outlet />
      </div>
    </Fragment>
  )
}

export default SettingsLayout
