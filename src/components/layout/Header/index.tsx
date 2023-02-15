import React, { useContext } from 'react'
import { useEnsName } from 'wagmi'
import W3iContext from '../../../contexts/W3iContext/context'
import { truncate } from '../../../utils/string'
import Avatar from '../../account/Avatar'
import './Header.scss'

const Header: React.FC = () => {
  const { userPubkey } = useContext(W3iContext)
  const { data: ensName } = useEnsName({ address: userPubkey as `0x${string}` })

  return (
    <div className="Header">
      <div className="Header__account">
        <Avatar address={userPubkey as `0x${string}`} width="1.5em" height="1.5em" />
        <span>{ensName ?? truncate(userPubkey ?? '', 5)}</span>
      </div>
    </div>
  )
}

export default Header
