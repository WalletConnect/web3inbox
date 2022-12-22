import React from 'react'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import { truncate } from '../../../utils/string'
import Avatar from '../../account/Avatar'
import './Header.scss'

const Header: React.FC = () => {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ address })

  return (
    <div className="Header">
      <div className="Header__account">
        <Avatar src={ensAvatar} width="1.5em" height="1.5em" />
        <span>{ensName ?? truncate(address ?? '', 5)}</span>
      </div>
    </div>
  )
}

export default Header
