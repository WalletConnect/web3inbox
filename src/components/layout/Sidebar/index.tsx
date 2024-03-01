import React, { useContext, useMemo } from 'react'

import cn from 'classnames'
import { Link, useLocation } from 'react-router-dom'

import Avatar from '@/components/account/Avatar'
import MessageIcon from '@/components/general/Icon/MessageIcon'
import NotificationIcon from '@/components/general/Icon/NotificationIcon'
import SettingIcon from '@/components/general/Icon/SettingIcon'
import ConnectWalletButton from '@/components/login/ConnectWalletButton'
import W3iContext from '@/contexts/W3iContext/context'
import { getEthChainAddress } from '@/utils/address'
import { NAVIGATION } from '@/utils/constants'
import { useIsMobile } from '@/utils/hooks'

import './Sidebar.scss'

const SidebarItem: React.FC<{ children?: React.ReactNode; isDisabled?: boolean }> = ({
  children,
  isDisabled
}) => {
  return (
    <div className={cn('Sidebar__Item', isDisabled && 'Sidebar__Item-disabled')}>{children}</div>
  )
}

const Sidebar: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const { pathname } = useLocation()
  const navigationPaths = useMemo(() => pathname.split('/'), [pathname])
  const { userPubkey } = useContext(W3iContext)
  const isMobile = useIsMobile()
  const navItems: [React.ReactNode, string][] = [
    [
      <NotificationIcon isFilled={pathname.startsWith(NAVIGATION.notifications.index)} />,
      NAVIGATION.notifications.index
    ],
    [
      <SettingIcon isFilled={pathname.startsWith(NAVIGATION.settings.index)} />,
      NAVIGATION.settings.index
    ]
  ]

  // If pathname matches .*/.*/.*
  // As per design, sidebar in mobile is hidden when on "Main" is viewed on messages
  // And hidden when "TargetSelector" is viewed
  if (isMobile && navigationPaths.includes('messages') && navigationPaths.length > 2) {
    return null
  }

  return (
    <div className="Sidebar">
      {!isMobile && (
        <SidebarItem>
          <Link to={`/notifications/new-app`}>
            <img alt="Web3Inbox icon" className="wc-icon" src="/icon.png" />
          </Link>
        </SidebarItem>
      )}
      <SidebarItem isDisabled={!isLoggedIn}>
        <div className="Sidebar__Navigation">
          {navItems.map(([icon, path]) => (
            <Link
              className={cn(
                'Sidebar__Navigation__Link',
                pathname.startsWith(path) && 'Sidebar__Navigation__Link-active',
                !isLoggedIn && `Sidebar__Navigation__Link-disabled`
              )}
              key={path}
              to={path}
            >
              {icon}
            </Link>
          ))}
        </div>
      </SidebarItem>

      <SidebarItem>
        {isLoggedIn ? (
          <Avatar
            address={getEthChainAddress(userPubkey) as `0x${string}`}
            width="2em"
            height="2em"
          />
        ) : (
          <ConnectWalletButton />
        )}
      </SidebarItem>
    </div>
  )
}

export default Sidebar
