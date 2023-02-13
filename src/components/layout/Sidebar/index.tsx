import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import Logo from '../../../assets/Logo.svg'
import { useIsMobile } from '../../../utils/hooks'
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
  const navigationPaths = useMemo(() => pathname.split('/'), [pathname])
  const { address } = useAccount()
  const isMobile = useIsMobile()
  const navItems = useMemo(
    () => [
      [<MessageIcon isFilled={pathname.includes('/messages')} />, 'messages'],
      [<NotificationIcon isFilled={pathname.includes('/notifications')} />, 'notifications'],
      [<SettingIcon isFilled={pathname.includes('/settings')} />, 'settings']
    ],
    [pathname]
  )

  // If pathname matches .*/.*/.*
  // As per design, sidebar in mobile is hidden when on "Main" is viewed on messages
  // And hidden when "TargetSelector" is viewed
  if (isMobile && navigationPaths.includes('messages') && navigationPaths.length > 2) {
    return null
  }

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
      {!isMobile && (
        <SidebarItem>
          <img alt="WC logo" src={Logo} />
        </SidebarItem>
      )}
    </div>
  )
}

export default Sidebar
