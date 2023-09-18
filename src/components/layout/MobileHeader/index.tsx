import React, { useContext } from 'react'
import './MobileHeader.scss'
import Avatar from '../../account/Avatar'
import WalletConnectIcon from '../../general/Icon/WalletConnectIcon'
import { Link } from 'react-router-dom'
import Text from '../../general/Text'
import W3iContext from '../../../contexts/W3iContext/context'

interface IMobileHeaderProps {
  title: string
}
const MobileHeader: React.FC<IMobileHeaderProps> = ({ title }) => {
  const { userPubkey } = useContext(W3iContext)

  return (
    <div className="MobileHeader">
      <Link className="MobileHeader__icon" to={`/notifications/new-app`}>
        <WalletConnectIcon />
      </Link>
      <Text className="MobileHeader__title" variant="paragraph-700">
        {title}
      </Text>
      <Avatar
        address={userPubkey as `0x${string}`}
        width="1.875em"
        height="1.875em"
        hasProfileDropdown
      />
    </div>
  )
}

export default MobileHeader
