import { useContext, useEffect, useState } from 'react'

import SettingsContext from '@/contexts/SettingsContext/context'
import { assertDefined } from '@/utils/assertDefined'

import './DevTimeStamp.scss'

const getTimeStampFormatted = (rawTimestamp: number) => {
  const timestamp = new Date(rawTimestamp)

  const year = timestamp.getFullYear()

  // Months are zero-indexed
  const month = (timestamp.getMonth() + 1).toString().padStart(2, '0')
  const day = timestamp.getDate().toString().padStart(2, '0')
  const hours = timestamp.getHours().toString().padStart(2, '0')
  const minutes = timestamp.getMinutes().toString().padStart(2, '0')
  const seconds = timestamp.getSeconds().toString().padStart(2, '0')

  const timeZone = assertDefined(
    new Intl.DateTimeFormat('en', { timeZoneName: 'short' })
      .formatToParts(timestamp)
      .find(part => part.type === 'timeZoneName')
  ).value

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${timeZone}`

  return formattedDateTime
}

const DevTimeStamp = () => {
  const [timestamp, setTimestamp] = useState(Date.now())
  const { isDevModeEnabled } = useContext(SettingsContext)

  useEffect(() => {
    if (isDevModeEnabled) {
      const intervalId = setInterval(() => {
        setTimestamp(Date.now())
      }, 250)

      return () => clearInterval(intervalId)
    }
  }, [setTimestamp, isDevModeEnabled])

  if (!isDevModeEnabled) {
    return null
  }

  return (
    <div className="DevTimeStamp">
      <span>{getTimeStampFormatted(timestamp)}</span>
    </div>
  )
}

export default DevTimeStamp
