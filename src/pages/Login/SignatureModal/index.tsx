import React, { useCallback } from 'react'

import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { useDisconnect } from 'wagmi'

import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import SignatureIcon from '@/components/general/Icon/SignatureIcon'
import Wallet from '@/components/general/Icon/Wallet'
import { Modal } from '@/components/general/Modal/Modal'
import Text from '@/components/general/Text'
import { logError } from '@/utils/error'
import { useModals } from '@/utils/hooks'
import { signatureModalService } from '@/utils/store'

import { SignatureLoadingVisual } from './SignatureLoadingVisual'

import './SignatureModal.scss'

export const SignatureModal: React.FC<{
  message: string
  sender: 'chat' | 'notify'
}> = ({ message, sender }) => {
  /*
   * If identity was already signed, and sync was requested then we are in the
   * final step.
   */
  const { isSigning } = useModals()
  const { disconnect } = useDisconnect()

  const onSign = useCallback(() => {
    signatureModalService.startSigning()
    window.web3inbox
      .signMessage(message)
      .then(signature => {
        switch (sender) {
          case 'chat':
            console.warn('[Web3Inbox] Signing messages for chat is not supported.')
            break
          case 'notify':
            window.web3inbox.notify.postMessage(
              formatJsonRpcRequest('notify_signature_delivered', { signature })
            )
            break
          default:
            logError(new Error(`No correct sender for signature modal, sender: ${sender}`))
        }
      })
      .catch(() => {
        signatureModalService.stopSigning()
      })
  }, [message, sender])

  return (
    <Modal onCloseModal={signatureModalService.closeModal}>
      <div className="SignatureModal">
        <div className="SignatureModal__header">
          <div onClick={() => disconnect()} className="SignatureModal__exit">
            <CrossIcon />
          </div>
        </div>
        {isSigning ? (
          <SignatureLoadingVisual />
        ) : (
          <div className="SignatureModal__icon">
            <SignatureIcon />
          </div>
        )}
        <Text className="SignatureModal__title" variant="large-600">
          {isSigning ? 'Requesting sign-in' : 'Sign in to enable notifications'}
        </Text>
        <Text className="SignatureModal__url" variant="small-400">
          app.web3inbox.com
        </Text>
        <Text className="SignatureModal__description" variant="small-500">
          To fully use Web3Inbox, please sign into app.web3inbox.com with your wallet.
        </Text>
        <div className="SignatureModal__button">
          <Button
            disabled={isSigning}
            textVariant="paragraph-600"
            rightIcon={isSigning ? null : <Wallet />}
            onClick={onSign}
          >
            {isSigning ? 'Waiting for wallet...' : 'Sign in with wallet'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
