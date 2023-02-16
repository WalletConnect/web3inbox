import { format, isSameWeek, isToday, isYesterday } from 'date-fns'
import React, { useMemo } from 'react'
import { getEthChainAddress, isValidEnsDomain } from '../../../utils/address'
import { useIsMobile } from '../../../utils/hooks'
import { truncate } from '../../../utils/string'
import Avatar from '../../account/Avatar'
import TextWithHighlight from '../../general/TextWithHighlight'
import './PeerAndMessage.scss'

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
  const messageSentAt = useMemo(() => {
    if (!timestamp) {
      return null
    }
    const today = new Date()
    const messageDate = new Date(timestamp)

    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm')
    }
    if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`
    }
    if (isSameWeek(today, messageDate)) {
      return format(messageDate, 'iiii')
    }

    return format(messageDate, 'MMMM dd')
  }, [timestamp])

  return (
    <div className="PeerAndMessage">
      {withAvatar && <Avatar width={'2.25em'} address={address} height={'2.25em'} />}
      <div className="PeerAndMessage__text">
        <div className={`PeerAndMessage__peer${isMobile ? '__mobile' : ''}`}>
          <TextWithHighlight
            text={isValidEnsDomain(peer) ? peer : truncate(getEthChainAddress(peer), 8)}
            highlightedText={highlightedText ?? ''}
          />
          {isMobile && <span className="PeerAndMessage__message__timestamp">{messageSentAt}</span>}
        </div>
        {message && (
          <div className={'PeerAndMessage__message__details'}>
            <div className={'PeerAndMessage__message'}>
              <TextWithHighlight text={message} highlightedText={highlightedText ?? ''} />
            </div>
            {!isMobile && (
              <span className="PeerAndMessage__message__timestamp">{messageSentAt}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PeerAndMessage
