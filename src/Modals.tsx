import { useMobileResponsiveGrid, useModals } from './utils/hooks'
import { Profile } from './components/account/Profile'
import { Share } from './components/account/Share/Share'
import { PreferencesModal } from './components/notifications/NotificationsLayout/PreferencesModal'
import { UnsubscribeModal } from './components/notifications/NotificationsLayout/UnsubscribeModal'
import { SignatureModal } from './pages/Login/SignatureModal'
import Subscribe from './components/notifications/SubscribeModal'
import { useContext, useEffect } from 'react'
import W3iContext from './contexts/W3iContext/context'
import { signatureModalService } from './utils/store'

export const Modals = () => {
  const {
    isProfileModalOpen,
    isShareModalOpen,
    isPreferencesModalOpen,
    isUnsubscribeModalOpen,
    isSignatureModalOpen,
    isSubscribeModalOpen
  } = useModals()

  const { chatRegisterMessage, pushRegisterMessage, registeredKey, userPubkey } =
    useContext(W3iContext)

  useEffect(() => {
    const chatSignatureRequired = !registeredKey && chatRegisterMessage
    const pushSignatureRequired = Boolean(pushRegisterMessage)
    console.log({ chatSignatureRequired, pushSignatureRequired })
    if (userPubkey && (chatSignatureRequired || pushSignatureRequired)) {
      signatureModalService.openModal()
    } else {
      signatureModalService.closeModal()
    }
  }, [userPubkey, registeredKey, chatRegisterMessage, pushRegisterMessage])

  return (
    <>
      {isProfileModalOpen && <Profile />}
      {isShareModalOpen && <Share />}
      {isSubscribeModalOpen && <Subscribe />}
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
