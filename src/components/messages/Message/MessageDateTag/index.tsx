import { useMemo } from 'react'

import { format, isSameWeek, isToday, isYesterday } from 'date-fns'

import Text from '@/components/general/Text'

import './MessageDateTag.scss'

interface IMessageDateTagProps {
  timestamp: number
  className?: string
  noText?: boolean
}
const MessageDateTag: React.FC<IMessageDateTagProps> = ({
  timestamp,
  className,
  noText
}: IMessageDateTagProps) => {
  const dateToDisplay = useMemo(() => {
    if (!timestamp) {
      return null
    }
    const today = new Date()
    const messageDate = new Date(timestamp)

    if (isToday(messageDate)) {
      if (noText) {
        return `${format(messageDate, 'HH:mm')}`
      }

      return `Today ${format(messageDate, 'HH:mm')}`
    }
    if (isYesterday(messageDate)) {
      if (noText) {
        return `${format(messageDate, 'HH:mm')}`
      }

      return `Yesterday ${format(messageDate, 'HH:mm')}`
    }
    if (isSameWeek(today, messageDate)) {
      return `${format(messageDate, 'iiii HH:mm')}`
    }

    return format(messageDate, 'MMMM dd HH:mm')
  }, [timestamp])

  return (
    <div className={`MessageDateTag ${className ? className : ''}`}>
      <Text variant="link-500">{dateToDisplay}</Text>
    </div>
  )
}

export default MessageDateTag
