import React, { useContext } from 'react'
import MessagesFilled from '../../../assets/MessagesFilled.svg'
import Messages from '../../../assets/Messages.svg'
import Notifications from '../../../assets/Notifications.svg'
import NotificationsFilled from '../../../assets/NotificationsFilled.svg'
import Settings from '../../../assets/Settings.svg'
import SettingsFilled from '../../../assets/SettingsFilled.svg'
import Logo from '../../../assets/Logo.svg'
import './Sidebar.scss'
import { Link, useLocation } from 'react-router-dom'
import ChatContext from '../../../contexts/ChatContext/context'
import Avatar from '../../account/Avatar'

const SidebarItem: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="Sidebar__Item">{children}</div>
}

const Sidebar: React.FC = () => {
  const { pathname } = useLocation()
  const { userPubkey } = useContext(ChatContext)

  return (
    <div className="Sidebar">
      <SidebarItem>
        <Avatar address={userPubkey} width="2em" height="2em" />
      </SidebarItem>
      <SidebarItem>
        <div className="Sidebar__Navigation">
          {[
            [pathname.includes('/messages') ? MessagesFilled : Messages, 'messages'],
            [
              pathname.includes('/notifications') ? NotificationsFilled : Notifications,
              'notifications'
            ],
            [pathname.includes('/settings') ? SettingsFilled : Settings, 'settings']
          ].map(([itemSrc, itemName]) => (
            <Link key={itemName} to={`/${itemName}`}>
              <img alt={itemName} src={itemSrc} />
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
