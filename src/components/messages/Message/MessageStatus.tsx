import type { ChatClientTypes } from '@walletconnect/chat-client'
import React, { useCallback, useContext } from 'react'
import W3iContext from '../../../contexts/W3iContext/context'
import type { ReplayMessage } from '../../../w3iProxy/w3iChatFacade'
import CheckIcon from '../../general/Icon/CheckIcon'
import RetryIcon from '../../general/Icon/RetryIcon'
import Spinner from '../../general/Spinner'

interface MessageStatusProps {
  status: ReplayMessage['status']
  message: ChatClientTypes.Message
  isLastMessage: boolean
}

const getMessageStatusText = (status: ReplayMessage['status'], onRetry: () => void) => {
  switch (status) {
    case 'failed':
      return (
        <div className="Message__retry" onClick={onRetry}>
          Failed to send <RetryIcon />
        </div>
      )
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

const MessageStatus: React.FC<MessageStatusProps> = ({ status, message, isLastMessage }) => {
  const shouldShowMessageStatus = status !== 'sent' || isLastMessage
  const { chatClientProxy } = useContext(W3iContext)

  if (!shouldShowMessageStatus) {
    return null
  }

  const onRetry = useCallback(() => {
    chatClientProxy?.retryMessage(message)
  }, [message, chatClientProxy])

  return <div className="Message__status">{getMessageStatusText(status, onRetry)}</div>
}

export default MessageStatus
