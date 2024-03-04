import React from 'react'

import { usePrepareRegistration, useRegister } from '@web3inbox/react'
import { useAccount, useDisconnect } from 'wagmi'

import Button from '@/components/general/Button'
import CrossIcon from '@/components/general/Icon/CrossIcon'
import SignatureIcon from '@/components/general/Icon/SignatureIcon'
import Wallet from '@/components/general/Icon/Wallet'
import { Modal } from '@/components/general/Modal/Modal'
import Spinner from '@/components/general/Spinner'
import Text from '@/components/general/Text'
import { useModals } from '@/utils/hooks'
import { signatureModalService } from '@/utils/store'

import { SignatureLoadingVisual } from './SignatureLoadingVisual'

import './SignatureModal.scss'

export const SignatureModal: React.FC = () => {
  const { status } = useAccount()
  const connected = status === 'connected'

  const { prepareRegistration } = usePrepareRegistration()
  const { register } = useRegister()

  /*
   * If identity was already signed, and sync was requested then we are in the
   * final step.
   */
  const { isSigning } = useModals()
  const { disconnect } = useDisconnect()

  const onSign = async () => {
    try {
      signatureModalService.startSigning()

      const { message, registerParams } = await prepareRegistration()

      console.log(">>>CACAO", registerParams.cacaoPayload);

      const signature = await window.web3inbox.signMessage(message)
      await register({ registerParams, signature }).then(() => signatureModalService.closeModal())
    } catch {
      signatureModalService.stopSigning()
    }
  }

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
            disabled={isSigning || !connected}
            textVariant="paragraph-600"
            rightIcon={!connected ? <Spinner /> : isSigning ? null : <Wallet />}
            onClick={onSign}
          >
            {isSigning ? 'Waiting for wallet...' : 'Sign in with wallet'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
