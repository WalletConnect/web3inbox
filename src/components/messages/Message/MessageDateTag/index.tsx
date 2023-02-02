import { format, isToday, isYesterday } from 'date-fns'
import { useMemo } from 'react'
import './MessageDateTag.scss'

interface IMessageDateTagProps {
  timestamp: number
}
const MessageDateTag: React.FC<IMessageDateTagProps> = ({ timestamp }: IMessageDateTagProps) => {
  const dateToDisplay = useMemo(() => {
    const date = new Date(timestamp)

    // eslint-disable-next-line no-nested-ternary
    return isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMMM dd')
  }, [timestamp])

  return <div className="MessageDateTag">{dateToDisplay}</div>
}

export default MessageDateTag
