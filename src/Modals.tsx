import { useContext, useEffect } from 'react'

import { AnimatePresence } from 'framer-motion'

import { PreferencesModal } from '@/components/notifications/NotificationsLayout/PreferencesModal'
import { UnsubscribeModal } from '@/components/notifications/NotificationsLayout/UnsubscribeModal'
import ChangeBrowserModal from '@/components/utils/ChangeBrowserModal'
import NotificationPwaModal from '@/components/utils/NotificationPwaModal'
import PwaModal from '@/components/utils/PwaModal'
import W3iContext from '@/contexts/W3iContext/context'
import { SignatureModal } from '@/pages/Login/SignatureModal'
import { isCI } from '@/utils/env'
import { useModals } from '@/utils/hooks'
import { useNotificationPermissionState } from '@/utils/hooks/notificationHooks'
import {
  checkIfNotificationModalClosed,
  notificationsAvailableInBrowser
} from '@/utils/notifications'
import { isAppleMobile, isMobileButNotInstalledOnHomeScreen, isNonSafari } from '@/utils/pwa'
import { notificationPwaModalService, signatureModalService } from '@/utils/store'
import { isMobile } from '@/utils/ui'

export const Modals = () => {
  const {
    isPreferencesModalOpen,
    isUnsubscribeModalOpen,
    isSignatureModalOpen,
    isNotificationPwaModalOpen,
    isSigning,
    oneClickAuthMode
  } = useModals()

  const { notifyRegisteredKey, userPubkey, clientReady } = useContext(W3iContext)

  const notificationsEnabled = useNotificationPermissionState()

  const notificationModalClosed = checkIfNotificationModalClosed()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const explicitlyDeniedOnDesktop = !isMobile() && window.Notification?.permission === 'denied'
  const shouldShowChangeBrowserModal = isAppleMobile ? isNonSafari : false
  const shouldShowPWAModal = isMobileButNotInstalledOnHomeScreen && !shouldShowChangeBrowserModal
  const shouldShowSignatureModal = isSignatureModalOpen && !shouldShowChangeBrowserModal
  const shouldShowUnsubscribeModalOpen = isUnsubscribeModalOpen && !shouldShowChangeBrowserModal
  const shouldShowPreferencesModalOpen = isPreferencesModalOpen && !shouldShowChangeBrowserModal

  const shouldShowNotificationModal =
    notificationsAvailableInBrowser() &&
    !explicitlyDeniedOnDesktop &&
    !isMobileButNotInstalledOnHomeScreen &&
    !notificationsEnabled &&
    Boolean(notifyRegisteredKey) &&
    !isSignatureModalOpen &&
    !notificationModalClosed &&
    !shouldShowChangeBrowserModal

  useEffect(() => {
    const shouldOpenSignatureModal = !notifyRegisteredKey && !oneClickAuthMode &&
    (isSignatureModalOpen || (userPubkey && clientReady && !notifyRegisteredKey)) &&
    !shouldShowChangeBrowserModal

    if(shouldOpenSignatureModal) {
      if(!isSigning) {
        signatureModalService.openModal()
      }
    } else {
      signatureModalService.closeModal()
    }
  }, [isSigning, oneClickAuthMode, isSignatureModalOpen, notifyRegisteredKey, userPubkey, clientReady, shouldShowChangeBrowserModal])

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
    <AnimatePresence mode="popLayout">
      {shouldShowUnsubscribeModalOpen && <UnsubscribeModal />}

      {shouldShowPreferencesModalOpen && <PreferencesModal />}

      {shouldShowSignatureModal && <SignatureModal />}

      {shouldShowPWAModal && <PwaModal />}

      {!isCI && isNotificationPwaModalOpen && <NotificationPwaModal />}

      {shouldShowChangeBrowserModal && <ChangeBrowserModal />}
    </AnimatePresence>
  )
}
