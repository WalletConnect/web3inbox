import { useModals } from './utils/hooks'
import { PreferencesModal } from './components/notifications/NotificationsLayout/PreferencesModal'
import { UnsubscribeModal } from './components/notifications/NotificationsLayout/UnsubscribeModal'
import { SignatureModal } from './pages/Login/SignatureModal'
import { useContext, useEffect } from 'react'
import W3iContext from './contexts/W3iContext/context'
import { signatureModalService } from './utils/store'
import { AnimatePresence } from 'framer-motion'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { isMobileButNotInstalledOnHomescreen } from './utils/pwa'
import PwaModal from './components/utils/PwaModal'

export const Modals = () => {
  const { isPreferencesModalOpen, isUnsubscribeModalOpen, isSignatureModalOpen } = useModals()
  const { close: closeWeb3Modal } = useWeb3Modal()

  const { notifyRegisterMessage, notifyRegisteredKey, userPubkey } = useContext(W3iContext)

  useEffect(() => {
    const notifySignatureRequired = Boolean(notifyRegisterMessage)
    if (userPubkey && notifySignatureRequired) {
      closeWeb3Modal() // close web3modal in case user is switching accounts
      signatureModalService.openModal()
    } else {
      signatureModalService.closeModal()
    }
  }, [userPubkey, closeWeb3Modal, notifyRegisteredKey, notifyRegisterMessage])

  return (
    <>
      <AnimatePresence mode="popLayout">
        {isUnsubscribeModalOpen && <UnsubscribeModal />}

        {isPreferencesModalOpen && <PreferencesModal />}

        {isSignatureModalOpen && (
          <SignatureModal message={notifyRegisterMessage ?? ''} sender={'notify'} />
        )}

	{
	  isMobileButNotInstalledOnHomescreen() && (
	    <PwaModal />
	  )
	}
      </AnimatePresence>
    </>
  )
}
