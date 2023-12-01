import React from 'react'
import { getEthChainAddress, isValidEnsDomain } from '@/utils/address'
import { useIsMobile } from '@/utils/hooks'
import { truncate } from '@/utils/string'
import Avatar from '@/components/account/Avatar'
import TextWithHighlight from '@/components/general/TextWithHighlight'
import './PeerAndMessage.scss'
import MessageDateTag from '../Message/MessageDateTag'

interface PeerAndMessageProps {
  peer: string
  withAvatar?: boolean
  highlightedText?: string
  message?: string
  timestamp?: number
}

const PeerAndMessage: React.FC<PeerAndMessageProps> = ({
  peer,
  message,
  highlightedText,
  timestamp,
  withAvatar = true
}) => {
  const isMobile = useIsMobile()
  const address = getEthChainAddress(peer)

  return (
    <div className="PeerAndMessage">
      {withAvatar && <Avatar width={'3rem'} address={address} height={'3rem'} />}
      <div className="PeerAndMessage__text">
        <div className={`PeerAndMessage__peer${isMobile ? '__mobile' : ''}`}>
          <TextWithHighlight
            text={isValidEnsDomain(peer) ? peer : truncate(getEthChainAddress(peer), 5)}
            highlightedText={highlightedText ?? ''}
          />
          {timestamp && (
            <MessageDateTag
              className="PeerAndMessage__message__timestamp"
              noText={true}
              timestamp={timestamp}
            />
          )}
        </div>
        {message && (
          <div className={'PeerAndMessage__message__details'}>
            <div className={'PeerAndMessage__message'}>
              <TextWithHighlight text={message} highlightedText={highlightedText ?? ''} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PeerAndMessage
