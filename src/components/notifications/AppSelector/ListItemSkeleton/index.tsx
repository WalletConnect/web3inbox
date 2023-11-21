import React from 'react'
import './ListItemSkeleton.scss'

const ListItemSkeleton: React.FC = () => {
  return (
    <div className="AppSelector__link-item-skeleton">
      <div className="AppSelector__link-item-skeleton__icon"></div>
      <div className="AppSelector__link-item-skeleton__description"></div>
    </div>
  )
}

export default ListItemSkeleton
