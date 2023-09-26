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

  const { pushRegisterMessage, pushRegisteredKey, userPubkey } = useContext(W3iContext)

  useEffect(() => {
    const pushSignatureRequired = !pushRegisteredKey && pushRegisterMessage
    if (userPubkey && pushSignatureRequired) {
      signatureModalService.openModal()
    } else {
      signatureModalService.closeModal()
    }
  }, [userPubkey, pushRegisteredKey, pushRegisterMessage])

  return (
    <>
      <AnimatePresence mode="popLayout">
        {isUnsubscribeModalOpen && <UnsubscribeModal />}

        {isPreferencesModalOpen && <PreferencesModal />}

        {isSignatureModalOpen && (
          <SignatureModal message={pushRegisterMessage ?? ''} sender={'push'} />
        )}
      </AnimatePresence>
    </>
  )
}
