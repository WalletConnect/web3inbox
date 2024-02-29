import React, { useMemo, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import NewAppIcon from '@/components/general/Icon/NewAppIcon'
import NotificationIcon from '@/components/general/Icon/NotificationIcon'
import SettingIcon from '@/components/general/Icon/SettingIcon'

import './MobileFooter.scss'

const MobileFooter: React.FC = () => {
  const { pathname } = useLocation()
  const [navItems] = useState(
    [
      [<NotificationIcon isFilled={pathname.endsWith('/notifications')} />, 'notifications'],
	[<NewAppIcon isFilled={pathname.includes('/new-app')} />, 'new-app'],
      [<SettingIcon isFilled={pathname.includes('/settings')} />, 'settings']
    ] as const
  )
  return (
    <div className="MobileFooter">
      {navItems.map(([icon, itemName]) => (
        <Link className="MobileFooter__link" key={itemName} to={`/${itemName}`}>
          {icon}
        </Link>
      ))}
    </div>
  )
}

export default MobileFooter
