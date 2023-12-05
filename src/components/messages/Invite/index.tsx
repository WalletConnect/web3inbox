import React, { useContext } from 'react'

import Avatar from '@/components/account/Avatar'
import W3iContext from '@/contexts/W3iContext/context'

import './Invite.scss'

interface InviteProps {
  id: number
  address: string
  message: string
  onSuccessfulAccept: () => void
}

const Invite: React.FC<InviteProps> = ({ address, onSuccessfulAccept, id, message }) => {
  const { chatClientProxy } = useContext(W3iContext)
  const evmAddress = address.split(':')[2] as `0x${string}`

  return (
    <div
      onClick={() => chatClientProxy?.accept({ id }).then(onSuccessfulAccept)}
      className="Invite"
    >
      <div className="Invite__inviter" id={id.toString()}>
        <Avatar address={evmAddress} width="1.25em" height="1.25em" />
        <span>{address}</span>
      </div>
      <div className="Invite__message">{message}</div>
    </div>
  )
}

export default Invite
