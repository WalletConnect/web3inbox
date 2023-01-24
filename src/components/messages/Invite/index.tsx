import React, { useContext } from 'react'
import Avatar from '../../account/Avatar'
import ChatContext from '../../../contexts/ChatContext/context'
import './Invite.scss'

interface InviteProps {
  id: number
  address: string
  message: string
  onSuccessfulAccept: () => void
}

const Invite: React.FC<InviteProps> = ({ address, onSuccessfulAccept, id, message }) => {
  const { chatClientProxy } = useContext(ChatContext)
  const evmAddress = address.split(':')[2] as `0x${string}`

  console.log('Id is: ', id)

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
