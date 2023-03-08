import { signMessage } from '@wagmi/core'
import React, { useCallback } from 'react'
import Button from '../../../components/general/Button'
import { Modal } from '../../../components/general/Modal/Modal'
import { signatureModalService } from '../../../utils/store'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import './SignatureModal.scss'

export const SignatureModal: React.FC<{ message: string }> = ({ message }) => {
  const onSign = useCallback(() => {
    signMessage({ message }).then(signature => {
      window.web3inbox.chat.postMessage(
        formatJsonRpcRequest('chat_signature_delivered', { signature })
      )
    })
  }, [message])

  return (
    <Modal onToggleModal={signatureModalService.toggleModal}>
      <div className="SignatureModal">
        <div className="SignatureModal__header">
          <h2>Signature requested</h2>
        </div>
        <div className="SignatureModal__content">
          <div className="SignatureModal__content__title">
            <Button onClick={onSign}>Sign Message</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
