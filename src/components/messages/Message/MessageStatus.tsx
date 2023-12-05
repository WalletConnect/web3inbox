import React, { useCallback, useContext } from 'react'

import CheckIcon from '@/components/general/Icon/CheckIcon'
import RetryIcon from '@/components/general/Icon/RetryIcon'
import Spinner from '@/components/general/Spinner'
import Text from '@/components/general/Text'
import W3iContext from '@/contexts/W3iContext/context'
import type { ChatClientTypes } from '@/w3iProxy/chatProviders/types'
import type { ReplayMessage } from '@/w3iProxy/w3iChatFacade'

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
          <Spinner /> Sending
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

  return (
    <div className="Message__status">
      <Text variant="tiny-500">{getMessageStatusText(status, onRetry)}</Text>
    </div>
  )
}

export default MessageStatus
