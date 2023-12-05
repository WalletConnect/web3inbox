import React, { useContext, useMemo } from 'react'

import { Link, useLocation } from 'react-router-dom'

import NewAppIcon from '@/components/general/Icon/NewAppIcon'
import NotificationIcon from '@/components/general/Icon/NotificationIcon'
import SettingIcon from '@/components/general/Icon/SettingIcon'
import W3iContext from '@/contexts/W3iContext/context'

import './MobileFooter.scss'

const MobileFooter: React.FC = () => {
  const { pathname } = useLocation()
  const { uiEnabled } = useContext(W3iContext)
  const navItems = useMemo(() => {
    const items: [React.ReactNode, string][] = []

    if (uiEnabled.notify) {
      items.push([
        <NotificationIcon isFilled={pathname.endsWith('/notifications')} />,
        'notifications'
      ])
    }

    if (uiEnabled.notify) {
      items.push([<NewAppIcon isFilled={pathname.includes('/new-app')} />, 'notifications/new-app'])
    }

    if (uiEnabled.settings) {
      items.push([<SettingIcon isFilled={pathname.includes('/settings')} />, 'settings'])
    }

    return items
  }, [pathname, uiEnabled])

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
