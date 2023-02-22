import type { ChatClientTypes } from '@walletconnect/chat-client'
import { differenceInHours } from 'date-fns'
import { useEffect, useMemo, useRef } from 'react'
import Message from '.'
import MessageDateTag from './MessageDateTag'

interface IMessageItemProps {
  messages: ChatClientTypes.Message[]
  message: ChatClientTypes.Message
  index: number
  peer?: string
}
export const MessageItem: React.FC<IMessageItemProps> = ({ messages, message, index, peer }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesEndRef, messages])

  const isFirstMessage = useMemo(() => index === 0, [index])
  const isLastMessage = useMemo(() => messages.length - 1 === index, [index, messages])

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

  console.log('MessageItem > message', JSON.stringify(message))

  return isLastMessage ? (
    <div ref={messagesEndRef}>
      {isDateTagDisplayed && <MessageDateTag timestamp={message.timestamp} />}
      <Message text={message.message} from={message.authorAccount === peer ? 'peer' : 'sender'} />
    </div>
  ) : (
    <div>
      {isDateTagDisplayed && <MessageDateTag timestamp={message.timestamp} />}
      <Message
        key={message.timestamp}
        text={message.message}
        from={message.authorAccount === peer ? 'peer' : 'sender'}
      />
    </div>
  )
}
