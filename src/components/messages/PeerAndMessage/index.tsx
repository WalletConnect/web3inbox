import React from 'react'
import { truncate } from '../../../utils/string'
import { getEthChainAddress, isValidEnsDomain } from '../../../utils/address'
import './PeerAndMessage.scss'
import Avatar from '../../account/Avatar'
import { useEnsAvatar } from 'wagmi'

interface PeerAndMessageProps {
  peer: string
  message?: string
}

const PeerAndMessage: React.FC<PeerAndMessageProps> = ({ peer, message }) => {
  const { data: avatar } = useEnsAvatar({ address: getEthChainAddress(peer) })

  return (
    <div className="PeerAndMessage">
      <Avatar width={'2.25em'} height={'2.25em'} src={avatar} />
      <div className="PeerAndMessage__text">
        <div className="PeerAndMessage__peer">
          {isValidEnsDomain(peer) ? peer : truncate(peer, 8)}
        </div>
        <div className="PeerAndMessage__message">{message}</div>
      </div>
    </div>
  )
}

export default PeerAndMessage
