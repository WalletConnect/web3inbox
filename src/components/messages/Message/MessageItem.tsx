import { useEffect, useMemo, useRef } from 'react'

import { differenceInHours } from 'date-fns'

import type { ChatClientTypes } from '@/w3iProxy/chatProviders/types'

import Message from '.'
import MessageDateTag from './MessageDateTag'
import MessageStatus from './MessageStatus'

interface IMessageItemProps {
  messages: ChatClientTypes.Message[]
  message: ChatClientTypes.Message
  index: number
  peer?: string
  status?: 'failed' | 'pending' | 'sent'
  previousMessageAccount?: string
  nextMessageAccount?: string
}

type ILocalMessageType = 'first' | 'last' | 'same' | 'solo'
export const MessageItem: React.FC<IMessageItemProps> = ({
  messages,
  message,
  index,
  peer,
  status,
  previousMessageAccount,
  nextMessageAccount
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messagesEndRef, messages])

  const isFirstMessage = useMemo(() => index === 0, [index])
  const isLastMessage = useMemo(() => messages.length - 1 === index, [index, messages])

  const localMessageType = useMemo<ILocalMessageType>(() => {
    if (
      message.authorAccount !== previousMessageAccount &&
      message.authorAccount !== nextMessageAccount
    ) {
      return 'solo'
    } else if (message.authorAccount !== previousMessageAccount) {
      return 'first'
    } else if (message.authorAccount !== nextMessageAccount) {
      return 'last'
    }

    return 'same'
  }, [messages])

  const isDateTagDisplayed = useMemo(() => {
    if (isFirstMessage) {
      return isFirstMessage
    }
    const prevMessage = messages[index - 1]
    const prevDate = new Date(prevMessage.timestamp)
    const currentDate = new Date(message.timestamp)
    const currentDateDay = currentDate.getDate()
    const isDifferentDay = prevDate.getDate() !== currentDateDay
    const hasTwoHoursGap = differenceInHours(currentDate, prevDate) >= 2

    return isDifferentDay || hasTwoHoursGap
  }, [index, messages, message.timestamp, isFirstMessage])

  return (
    <div
      className={`Message__container--${localMessageType} Message__recent--${
        message.authorAccount === peer ? 'peer' : 'sender'
      }`}
      ref={isLastMessage ? messagesEndRef : null}
    >
      {isDateTagDisplayed && <MessageDateTag timestamp={message.timestamp} />}
      <Message
        text={message.message}
        status={status}
        from={message.authorAccount === peer ? 'peer' : 'sender'}
      />
      {status && <MessageStatus message={message} isLastMessage={isLastMessage} status={status} />}
    </div>
  )
}
