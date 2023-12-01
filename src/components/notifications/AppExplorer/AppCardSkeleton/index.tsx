import * as React from 'react'

import './AppCardSkeleton.scss'

const AppCardSkeleton: React.FC = () => {
  return (
    <div className="AppCardSkeleton">
      <div className="AppCardSkeleton__header">
        <div className="AppCardSkeleton__header__logo" />
      </div>
      <div className="AppCardSkeleton__body">
        <div className="AppCardSkeleton__body__title" />
        <div className="AppCardSkeleton__body__subtitle" />
        <div className="AppCardSkeleton__body__description" />
        <div className="AppCardSkeleton__body__subscribed" />
      </div>
    </div>
  )
}

export default AppCardSkeleton
