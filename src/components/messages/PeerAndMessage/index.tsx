import React from 'react'
import { truncate } from '../../../utils/string'
import { getEthChainAddress, isValidEnsDomain } from '../../../utils/address'
import './PeerAndMessage.scss'
import Avatar from '../../account/Avatar'
import { useEnsAvatar } from 'wagmi'

interface PeerAndMessageProps {
  peer: string
  withAvatar?: boolean
  message?: string
}

const PeerAndMessage: React.FC<PeerAndMessageProps> = ({ peer, message, withAvatar = true }) => {
  const address = getEthChainAddress(peer)
  const { data: avatar } = useEnsAvatar({ address })

  return (
    <div className="PeerAndMessage">
      {withAvatar && <Avatar width={'2.25em'} address={address} height={'2.25em'} src={avatar} />}
      <div className="PeerAndMessage__text">
        <div className="PeerAndMessage__peer">
          {isValidEnsDomain(peer) ? peer : truncate(getEthChainAddress(peer), 8)}
        </div>
        {message && <div className="PeerAndMessage__message">{message}</div>}
      </div>
    </div>
  )
}

export default PeerAndMessage
