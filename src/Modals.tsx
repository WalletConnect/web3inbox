import { useModals } from './utils/hooks'
import { PreferencesModal } from './components/notifications/NotificationsLayout/PreferencesModal'
import { UnsubscribeModal } from './components/notifications/NotificationsLayout/UnsubscribeModal'
import { SignatureModal } from './pages/Login/SignatureModal'
import { useContext, useEffect } from 'react'
import W3iContext from './contexts/W3iContext/context'
import { signatureModalService } from './utils/store'
import { AnimatePresence } from 'framer-motion'

export const Modals = () => {
  const { isPreferencesModalOpen, isUnsubscribeModalOpen, isSignatureModalOpen } = useModals()

  const { notifyRegisterMessage, notifyRegisteredKey, userPubkey } = useContext(W3iContext)

  useEffect(() => {
    const notifySignatureRequired = !notifyRegisteredKey && notifyRegisterMessage
    if (userPubkey && notifySignatureRequired) {
      signatureModalService.openModal()
    } else {
      signatureModalService.closeModal()
    }
  }, [userPubkey, notifyRegisteredKey, notifyRegisterMessage])

  return (
    <>
      <AnimatePresence mode="popLayout">
        {isUnsubscribeModalOpen && <UnsubscribeModal />}

        {isPreferencesModalOpen && <PreferencesModal />}

        {isSignatureModalOpen && (
          <SignatureModal message={notifyRegisterMessage ?? ''} sender={'notify'} />
        )}
      </AnimatePresence>
    </>
  )
}
