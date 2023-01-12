import React, { useContext } from 'react'
import { useEnsAvatar, useEnsName } from 'wagmi'
import ChatContext from '../../../contexts/ChatContext/context'
import { truncate } from '../../../utils/string'
import Avatar from '../../account/Avatar'
import './Header.scss'

const Header: React.FC = () => {
  const { userPubkey } = useContext(ChatContext)
  const { data: ensName } = useEnsName({ address: userPubkey as `0x${string}` })
  const { data: ensAvatar } = useEnsAvatar({ address: userPubkey as `0x${string}` })

  return (
    <div className="Header">
      <div className="Header__account">
        <Avatar src={ensAvatar} width="1.5em" height="1.5em" />
        <span>{ensName ?? truncate(userPubkey ?? '', 5)}</span>
      </div>
    </div>
  )
}

export default Header
