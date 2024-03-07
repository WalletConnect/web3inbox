import React, { useContext, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import Avatar from '@/components/account/Avatar'
import ArrowLeftIcon from '@/components/general/Icon/ArrowLeftIcon'
import WalletConnectIcon from '@/components/general/Icon/WalletConnectIcon'
import Text from '@/components/general/Text'
import AppNotificationDropdown from '@/components/notifications/AppNotifications/AppNotificationDropdown'
import W3iContext from '@/contexts/W3iContext/context'
import { getEthChainAddress } from '@/utils/address'
import { NAVIGATION } from '@/utils/constants'

import './MobileHeader.scss'

interface IMobileHeaderProps {
  title: string
  back?: string
  notificationId?: string
}
const MobileHeader: React.FC<IMobileHeaderProps> = ({ title, back, notificationId }) => {
  const [dropdownToShow, setDropdownToShow] = useState<string | undefined>()

  const { userPubkey } = useContext(W3iContext)
  const nav = useNavigate()

  return (
    <div className="MobileHeader">
      {back ? (
        <div
          className="MobileHeader__arrow"
          onClick={() => {
            nav(back)
          }}
        >
          <ArrowLeftIcon />
        </div>
      ) : (
        <Link className="MobileHeader__icon" to={NAVIGATION.notifications.index}>
          <img alt="Web3Inbox icon" className="wc-icon" src="/icon.png" />
        </Link>
      )}

      <Text className="MobileHeader__title" variant="paragraph-700">
        {title}
      </Text>
      {notificationId ? (
        <AppNotificationDropdown
          closeDropdown={() => setDropdownToShow(undefined)}
          h="2.5em"
          w="2.5em"
          dropdownPlacement="bottomLeft"
          notificationId={notificationId}
        />
      ) : (
        <Avatar
          address={getEthChainAddress(userPubkey) as `0x${string}`}
          width="1.875em"
          height="1.875em"
        />
      )}
    </div>
  )
}

export default MobileHeader
