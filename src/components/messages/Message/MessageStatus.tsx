import React from 'react'
import type { ReplayMessage } from '../../../w3iProxy/w3iChatFacade'
import CheckIcon from '../../general/Icon/CheckIcon'
import Spinner from '../../general/Spinner'

interface MessageStatusProps {
  status: ReplayMessage['status']
  isLastMessage: boolean
}

const getMessageStatusText = (status: ReplayMessage['status']) => {
  switch (status) {
    case 'failed':
      return <div>Failed to send</div>
    case 'sent':
      return (
        <div>
          <CheckIcon /> Delivered {new Date().toLocaleTimeString().replace(/:.. .M/u, '')}
        </div>
      )
    case 'pending':
      return (
        <div>
          <Spinner width="1em" /> Sending
        </div>
      )
    default:
      return <div></div>
  }
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status, isLastMessage }) => {
  const shouldShowMessageStatus = status !== 'sent' || isLastMessage

  if (!shouldShowMessageStatus) {
    return null
  }

  return <div className="Message__status">{getMessageStatusText(status)}</div>
}

export default MessageStatus
