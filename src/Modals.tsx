import { useContext, useEffect, useMemo } from 'react'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { AnimatePresence } from 'framer-motion'

import { PreferencesModal } from '@/components/notifications/NotificationsLayout/PreferencesModal'
import { UnsubscribeModal } from '@/components/notifications/NotificationsLayout/UnsubscribeModal'
import NotificationPwaModal from '@/components/utils/NotificationPwaModal'
import PwaModal from '@/components/utils/PwaModal'
import W3iContext from '@/contexts/W3iContext/context'
import { SignatureModal } from '@/pages/Login/SignatureModal'
import { useModals } from '@/utils/hooks'
import { useNotificationPermissionState } from '@/utils/hooks/notificationHooks'
import { notificationsEnabledInBrowser } from '@/utils/notifications'
import { isMobileButNotInstalledOnHomescreen } from '@/utils/pwa'
import { notificationPwaModalService, signatureModalService } from '@/utils/store'
import { isMobile } from '@/utils/ui'

export const Modals = () => {
  const {
    isPreferencesModalOpen,
    isUnsubscribeModalOpen,
    isSignatureModalOpen,
    isNotificationPwaModalOpen
  } = useModals()
  const { close: closeWeb3Modal } = useWeb3Modal()

  const { notifyRegisterMessage, notifyRegisteredKey, userPubkey } = useContext(W3iContext)

  const notificationsEnabled = useNotificationPermissionState()

  const explicitlyDeniedOnDesktop = !isMobile() && window.Notification?.permission === 'denied'

  const shouldShowNotificationModal = useMemo(
    () =>
      notificationsEnabledInBrowser() &&
      !explicitlyDeniedOnDesktop &&
      !isMobileButNotInstalledOnHomescreen() &&
      !notificationsEnabled &&
      Boolean(notifyRegisteredKey) &&
      !isSignatureModalOpen,
    [explicitlyDeniedOnDesktop, notificationsEnabled, notifyRegisteredKey, isSignatureModalOpen]
  )

  useEffect(() => {
    const notifySignatureRequired = Boolean(notifyRegisterMessage) && !notifyRegisteredKey
    if (userPubkey && notifySignatureRequired) {
      closeWeb3Modal() // close web3modal in case user is switching accounts
      signatureModalService.openModal()
    } else {
      signatureModalService.closeModal()
    }
  }, [userPubkey, closeWeb3Modal, notifyRegisteredKey, notifyRegisterMessage])

  useEffect(() => {
    // Create an artificial delay to prevent modals being spammed one after the other
    if (shouldShowNotificationModal) {
      setTimeout(() => {
        notificationPwaModalService.openModal()
      }, 500)
    } else {
      notificationPwaModalService.closeModal()
    }
  }, [shouldShowNotificationModal])

  return (
    <>
      <AnimatePresence mode="popLayout">
        {isUnsubscribeModalOpen && <UnsubscribeModal />}

        {isPreferencesModalOpen && <PreferencesModal />}

        {isSignatureModalOpen && (
          <SignatureModal message={notifyRegisterMessage ?? ''} sender={'notify'} />
        )}

        {isMobileButNotInstalledOnHomescreen() && <PwaModal />}

        {isNotificationPwaModalOpen && <NotificationPwaModal />}
      </AnimatePresence>
    </>
  )
}
