import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import Logo from '../../../assets/Logo.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import Avatar from '../../account/Avatar'
import MessageIcon from '../../general/Icon/MessageIcon'
import NotificationIcon from '../../general/Icon/NotificationIcon'
import SettingIcon from '../../general/Icon/SettingIcon'
import './Sidebar.scss'

const SidebarItem: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="Sidebar__Item">{children}</div>
}

const Sidebar: React.FC = () => {
  const { pathname } = useLocation()
  const { address } = useAccount()
  const navItems = useMemo(
    () => [
      [<MessageIcon isFilled={pathname.includes('/messages')} />, 'messages'],
      [<NotificationIcon isFilled={pathname.includes('/notifications')} />, 'notifications'],
      [<SettingIcon isFilled={pathname.includes('/settings')} />, 'settings']
    ],
    [pathname]
  )

  return (
    <div className="Sidebar">
      <SidebarItem>
        <Avatar address={address} width="2em" height="2em" hasProfileDropdown />
      </SidebarItem>
      <SidebarItem>
        <div className="Sidebar__Navigation">
          {navItems.map(([icon, itemName]) => (
            <Link
              className="Sidebar__Navigation__Link"
              key={itemName as string}
              to={`/${itemName as string}`}
            >
              {icon}
            </Link>
          ))}
        </div>
      </SidebarItem>
      <SidebarItem>
        <img alt="WC logo" src={Logo} />
      </SidebarItem>
    </div>
  )
}

export default Sidebar
