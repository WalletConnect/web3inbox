import { useModals } from './utils/hooks'
import { Profile } from './components/account/Profile'
import { Share } from './components/account/Share/Share'
import { PreferencesModal } from './components/notifications/NotificationsLayout/PreferencesModal'
import { UnsubscribeModal } from './components/notifications/NotificationsLayout/UnsubscribeModal'
import { SignatureModal } from './pages/Login/SignatureModal'
import { useContext, useEffect } from 'react'
import W3iContext from './contexts/W3iContext/context'
import { signatureModalService } from './utils/store'

export const Modals = () => {
  const {
    isProfileModalOpen,
    isShareModalOpen,
    isPreferencesModalOpen,
    isUnsubscribeModalOpen,
    isSignatureModalOpen
  } = useModals()

  const {
    chatRegisterMessage,
    pushRegisterMessage,
    chatRegisteredKey,
    pushRegisteredKey,
    userPubkey
  } = useContext(W3iContext)

  useEffect(() => {
    const chatSignatureRequired = !chatRegisteredKey && chatRegisterMessage
    const pushSignatureRequired = !pushRegisteredKey && pushRegisterMessage

    if (userPubkey && (chatSignatureRequired || pushSignatureRequired)) {
      signatureModalService.openModal()
    } else {
      signatureModalService.closeModal()
    }
  }, [userPubkey, chatRegisteredKey, pushRegisteredKey, chatRegisterMessage, pushRegisterMessage])

  return (
    <>
      {isProfileModalOpen && <Profile />}
      {isShareModalOpen && <Share />}
      {isPreferencesModalOpen && <PreferencesModal />}
      {isUnsubscribeModalOpen && <UnsubscribeModal />}
      {isSignatureModalOpen && (
        <SignatureModal
          message={chatRegisterMessage ?? pushRegisterMessage ?? ''}
          sender={chatRegisterMessage ? 'chat' : 'push'}
        />
      )}
    </>
  )
}
