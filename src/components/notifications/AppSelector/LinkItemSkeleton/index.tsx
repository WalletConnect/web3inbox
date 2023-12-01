import React from 'react'

import './LinkItemSkeleton.scss'

const LinkItemSkeleton: React.FC = () => {
  return (
    <div className="AppSelector__link-item-skeleton">
      <div className="AppSelector__link-item-skeleton__icon"></div>
      <div className="AppSelector__link-item-skeleton__description"></div>
    </div>
  )
}

export default LinkItemSkeleton
