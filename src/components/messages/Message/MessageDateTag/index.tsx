import { format, isSameWeek, isToday, isYesterday } from 'date-fns'
import { useMemo } from 'react'
import './MessageDateTag.scss'

interface IMessageDateTagProps {
  timestamp: number
}
const MessageDateTag: React.FC<IMessageDateTagProps> = ({ timestamp }: IMessageDateTagProps) => {
  const dateToDisplay = useMemo(() => {
    if (!timestamp) {
      return null
    }
    const today = new Date()
    const messageDate = new Date(timestamp)

    if (isToday(messageDate)) {
      return `Today ${format(messageDate, 'HH:mm')}`
    }
    if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`
    }
    if (isSameWeek(today, messageDate)) {
      return `${format(messageDate, 'iiii HH:mm')}`
    }

    return format(messageDate, 'MMMM dd HH:mm')
  }, [timestamp])

  return <div className="MessageDateTag">{dateToDisplay}</div>
}

export default MessageDateTag
