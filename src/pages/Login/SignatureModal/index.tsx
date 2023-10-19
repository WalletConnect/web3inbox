import React, { useCallback, useContext, useState } from 'react'
import Button from '../../../components/general/Button'
import { Modal } from '../../../components/general/Modal/Modal'
import { signatureModalService } from '../../../utils/store'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import './SignatureModal.scss'
import Spinner from '../../../components/general/Spinner'
import Text from '../../../components/general/Text'
import SignatureIcon from '../../../components/general/Icon/SignatureIcon'
import CrossIcon from '../../../components/general/Icon/CrossIcon'
import W3iContext from '../../../contexts/W3iContext/context'
import { useDisconnect } from 'wagmi'

export const SignatureModal: React.FC<{
  message: string
  sender: 'chat' | 'notify'
}> = ({ message, sender }) => {
  /*
   * If identity was already signed, and sync was requested then we are in the
   * final step.
   */
  const [signing, setSigning] = useState(false)

  const { disconnect } = useDisconnect();

  const onSign = useCallback(() => {
    setSigning(true)
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
            console.error('No correct sender for signature modal')
        }
      })
      .catch(() => {
        setSigning(false)
      })
      .finally(() => {
        signatureModalService.closeModal()
        setTimeout(() => {
          setSigning(false)
        }, 300)
      })
  }, [message, sender, setSigning])

  return (
    <Modal onToggleModal={signatureModalService.toggleModal}>
      <div className="SignatureModal">
	<div className="SignatureModal__header">
          <div onClick={() => disconnect()} className="SignatureModal__exit">
	    <CrossIcon />
          </div>
	</div>
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
