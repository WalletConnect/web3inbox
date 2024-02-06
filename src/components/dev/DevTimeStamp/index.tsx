import { useContext, useEffect, useState } from 'react';
import './DevTimeStamp.scss'
import SettingsContext from '@/contexts/SettingsContext/context';

const DevTimeStamp = () => {
  const [timestamp, setTimestamp] = useState(Date.now())
  const {isDevModeEnabled} = useContext(SettingsContext)

  useEffect(() => {
    if(isDevModeEnabled) {
     const intervalId = setInterval(() => {
      setTimestamp(Date.now())
     }, 1)

     return () => clearInterval(intervalId)
    }
  }, [setTimestamp, isDevModeEnabled])

  if (!isDevModeEnabled) {
    return null;
  }

  return (
    <div className="DevTimeStamp">
      <p>{timestamp}</p>
    </div>
  )
}

export default DevTimeStamp;
