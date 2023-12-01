import React, { useContext, useMemo } from 'react'

import cn from 'classnames'
import { Link, useLocation } from 'react-router-dom'

import Avatar from '@/components/account/Avatar'
import MessageIcon from '@/components/general/Icon/MessageIcon'
import NotificationIcon from '@/components/general/Icon/NotificationIcon'
import SettingIcon from '@/components/general/Icon/SettingIcon'
import WalletConnectIcon from '@/components/general/Icon/WalletConnectIcon'
import ConnectWalletButton from '@/components/login/ConnectWalletButton'
import W3iContext from '@/contexts/W3iContext/context'
import { getEthChainAddress } from '@/utils/address'
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
  const { userPubkey, uiEnabled } = useContext(W3iContext)
  const isMobile = useIsMobile()
  const navItems = useMemo(() => {
    const items: [React.ReactNode, string][] = []

    if (uiEnabled.chat) {
      items.push([<MessageIcon isFilled={pathname.includes('/messages')} />, 'messages'])
    }

    if (uiEnabled.notify) {
      items.push([
        <NotificationIcon isFilled={pathname.includes('/notifications')} />,
        'notifications'
      ])
    }

    if (uiEnabled.settings) {
      items.push([<SettingIcon isFilled={pathname.includes('/settings')} />, 'settings/appearance'])
    }

    return items
  }, [pathname, uiEnabled])

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
            <WalletConnectIcon hoverable={isLoggedIn} />
          </Link>
        </SidebarItem>
      )}
      <SidebarItem isDisabled={!isLoggedIn}>
        <div className="Sidebar__Navigation">
          {navItems.map(([icon, itemName]) => (
            <Link
              className={cn(
                'Sidebar__Navigation__Link',
                pathname.includes(itemName) && 'Sidebar__Navigation__Link-active',
                !isLoggedIn && `Sidebar__Navigation__Link-disabled`
              )}
              key={itemName}
              to={`/${itemName}`}
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
