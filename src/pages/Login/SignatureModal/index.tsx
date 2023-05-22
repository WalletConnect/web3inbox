import { signMessage } from '@wagmi/core'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Button from '../../../components/general/Button'
import { Modal } from '../../../components/general/Modal/Modal'
import { signatureModalService } from '../../../utils/store'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import './SignatureModal.scss'
import CheckIcon from '../../../components/general/Icon/CheckIcon'
import Spinner from '../../../components/general/Spinner'
import CrossIcon from '../../../components/general/Icon/CrossIcon'
import W3iContext from '../../../contexts/W3iContext/context'

export const SignatureModal: React.FC<{ message: string }> = ({ message }) => {
  const { disconnect } = useContext(W3iContext)
  const purpose: 'identity' | 'sync' = message.includes('did:key') ? 'identity' : 'sync'
  /*
   * If identity was already signed, and sync was requested then we are in the
   * final step.
   */
  const [stepProgress, setStepProgress] = useState(purpose === 'identity' ? 0 : 1)
  const [signing, setSigning] = useState(false)

  const steps = [
    {
      step: 1,
      label: 'identity'
    },
    {
      step: 2,
      label: 'sync'
    }
  ]

  const onSign = useCallback(() => {
    setSigning(true)
    signMessage({ message }).then(signature => {
      setStepProgress(pv => pv + 1)
      window.web3inbox.chat.postMessage(
        formatJsonRpcRequest('chat_signature_delivered', { signature })
      )
    })
  }, [message, setStepProgress, setSigning])

  // Modal is ready to sign when given a new purpose
  useEffect(() => {
    setSigning(false)
  }, [purpose, setSigning])

  const purposeMessage =
    purpose === 'identity' ? 'Sign for your identity key.' : 'Sign for syncing capabilities'

  return (
    <Modal onToggleModal={signatureModalService.toggleModal}>
      <div className="SignatureModal">
        <div className="SignatureModal__cancel-container">
          <Button onClick={disconnect} customType="danger">
            <CrossIcon />
          </Button>
        </div>
        <div className="SignatureModal__header">
          <div className="SignatureModal__progress">
            <div className="SignatureModal__progress-bubbles">
              <div className="SignatureModal__progress-line"></div>
              {steps.map(({ step }) => (
                <div key={step} className="SignatureModal__progress-bubble-container">
                  <div
                    className={`SignatureModal__progress-bubble SignatureModal__progress-bubble-${
                      stepProgress > step - 1 ? 'checked' : ''
                    }`}
                  >
                    {stepProgress > step - 1 ? <CheckIcon /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="SignatureModal__header-text">
            <h2>Signature requested</h2>
          </div>
        </div>
        <div className="SignatureModal__explanation">
          <p>
            You need to perform a couple of signatures to establish an identity key and enable
            syncing across clients.
          </p>
        </div>
        <div className="SignatureModal__message">{purposeMessage}</div>
        <div className="SignatureModal__content">
          <Button disabled={signing} onClick={onSign}>
            {signing ? <Spinner width="1em" /> : 'Sign Message'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
