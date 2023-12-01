import { useEffect, useState } from 'react'

import QrReader from 'react-qr-reader-es6'
import { useNavigate } from 'react-router-dom'

import BackButton from '@/components/general/BackButton'
import TransitionDiv from '@/components/general/TransitionDiv'

import './ScanQrCode.scss'

const ScanQrCode: React.FC = () => {
  const [scanResult, setResult] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    if (!scanResult) {
      return
    }

    const web3inboxRegex = new RegExp(`${window.location.origin}/messages/invite/.*`, 'u')

    if (web3inboxRegex.test(scanResult)) {
      nav(scanResult.replace(window.location.origin, ''))
    } else {
      console.error('Not a valid invite url', scanResult)
      nav('/messages')
    }
  }, [scanResult])

  const dimensions = {
    width: 390,
    height: 844
  }

  return (
    <TransitionDiv className="ScanQrCode">
      <div className="ScanQrCode__header">
        <BackButton force={true} backTo="/messages/new-chat" />
        <span>Scan to invite</span>
      </div>
      <div className="ScanQrCode__body">
        <div className="ScanQrCode__container" style={dimensions}>
          <QrReader
            delay={150}
            facingMode="environment"
            onError={() => {
              nav('/messages?qrScan=fail')
            }}
            style={{ boxShadow: 'unset' }}
            resolution={3000}
            onScan={result => {
              if (result) {
                setResult(result)
              }
            }}
          />

          <div className="ScanQrCode__overlay_1"></div>
          <div className="ScanQrCode__overlay_2"></div>
        </div>
      </div>
    </TransitionDiv>
  )
}

export default ScanQrCode
