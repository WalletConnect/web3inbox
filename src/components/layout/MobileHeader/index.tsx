import React, { useContext, useState } from 'react'
import './MobileHeader.scss'
import Avatar from '../../account/Avatar'
import WalletConnectIcon from '../../general/Icon/WalletConnectIcon'
import { Link, useNavigate } from 'react-router-dom'
import Text from '../../general/Text'
import W3iContext from '../../../contexts/W3iContext/context'
import ArrowLeftIcon from '../../general/Icon/ArrowLeftIcon'
import AppNotificationDropdown from '../../notifications/AppNotifications/AppNotificationDropdown'
import { getEthChainAddress } from '../../../utils/address'

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
        <Link className="MobileHeader__icon" to={`/notifications/new-app`}>
          <WalletConnectIcon hoverable={false} />
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
