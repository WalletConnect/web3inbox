import TransitionDiv from '../../components/general/TransitionDiv'
import { QrReader } from 'react-qr-reader'
import './ScanQrCode.scss'
import { useEffect, useState } from 'react'
import BackButton from '../../components/general/BackButton'
import { useNavigate } from 'react-router-dom'

const ScanQrCode: React.FC = () => {
  const [scanResult, setResult] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    if (!scanResult) {
      return
    }
    const web3inboxRegex = new RegExp(`${window.location.origin}/messages/invite/.*`, 'u')
    if (web3inboxRegex.test(scanResult)) {
      nav(scanResult)
    } else {
      nav('/messages')
    }
  }, [scanResult])

  /*
   * Const dimensions = isMobile
   *   ? {
   *       width: window.innerWidth,
   *       height: window.innerHeight
   *     }
   *   : {
   *       width: window.innerWidth / SCANNER_ASPECT_RATIO,
   *       height: window.innerHeight / 1.25
   *     }
   */

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
            constraints={dimensions}
            onResult={result => {
              if (result) {
                setResult(result.getText())
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
