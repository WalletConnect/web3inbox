import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/general/Button'
import { Modal } from '../../../components/general/Modal/Modal'
import { signatureModalService } from '../../../utils/store'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import './SignatureModal.scss'
import Spinner from '../../../components/general/Spinner'
import Text from '../../../components/general/Text'
import SignatureIcon from '../../../components/general/Icon/SignatureIcon'

export const SignatureModal: React.FC<{
  message: string
  sender: 'chat' | 'push'
}> = ({ message, sender }) => {
  const purpose: 'identity' | 'sync' = message.includes('did:key') ? 'identity' : 'sync'
  /*
   * If identity was already signed, and sync was requested then we are in the
   * final step.
   */
  const [signing, setSigning] = useState(false)

  const onSign = useCallback(() => {
    setSigning(true)
    window.web3inbox
      .signMessage(message)
      .then(signature => {
        switch (sender) {
          case 'chat':
            window.web3inbox.chat.postMessage(
              formatJsonRpcRequest('chat_signature_delivered', { signature })
            )
            break
          case 'push':
            window.web3inbox.notify.postMessage(
              formatJsonRpcRequest('notify_signature_delivered', { signature })
            )
            break
          default:
            console.error('No correct sender for signature modal')
        }
      })
      .catch(() => {
        setSigning(false)
      })
      .finally(() =>
        setTimeout(() => {
          setSigning(false)
        }, 3000)
      )
  }, [message, sender, setSigning])

  // Modal is ready to sign when given a new purpose
  useEffect(() => {
    setTimeout(() => {
      setSigning(false)
    }, 3000)
  }, [purpose, setSigning])

  return (
    <Modal onToggleModal={signatureModalService.toggleModal}>
      <div className="SignatureModal">
        <div className="SignatureModal__icon">
          <SignatureIcon />
        </div>

        <Text className="SignatureModal__title" variant="large-600">
          {signing ? 'Requesting sign-in' : 'Sign in to enable notifications'}
        </Text>
        <Text className="SignatureModal__url" variant="small-400">
          app.web3inbox.com
        </Text>
        <Text className="SignatureModal__description" variant="small-500">
          To fully use Web3Inbox, please sign into app.web3inbox.com with your wallet.
        </Text>
        <div className="SignatureModal__button">
          <Button disabled={signing} onClick={onSign}>
            {signing ? <Spinner width="1em" /> : 'Sign in with wallet'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
