import React from 'react'
import { truncate } from '../../../utils/string'
import { getEthChainAddress, isValidEnsDomain } from '../../../utils/address'
import './PeerAndMessage.scss'
import Avatar from '../../account/Avatar'
import TextWithHighlight from '../../general/TextWithHighlight'

interface PeerAndMessageProps {
  peer: string
  withAvatar?: boolean
  highlightedText?: string
  message?: string
}

const PeerAndMessage: React.FC<PeerAndMessageProps> = ({
  peer,
  message,
  highlightedText,
  withAvatar = true
}) => {
  const address = getEthChainAddress(peer)

  return (
    <div className="PeerAndMessage">
      {withAvatar && <Avatar width={'2.25em'} address={address} height={'2.25em'} />}
      <div className="PeerAndMessage__text">
        <div className="PeerAndMessage__peer">
          <TextWithHighlight
            text={isValidEnsDomain(peer) ? peer : truncate(getEthChainAddress(peer), 8)}
            highlightedText={highlightedText ?? ''}
          />
        </div>
        {message && (
          <div className="PeerAndMessage__message">
            <TextWithHighlight text={message} highlightedText={highlightedText ?? ''} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PeerAndMessage
