import 'react-toastify/dist/ReactToastify.css'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import { Fragment, useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import './App.scss'
import { Profile } from './components/account/Profile'
import { Share } from './components/account/Share/Share'
import Sidebar from './components/layout/Sidebar'
import { PreferencesModal } from './components/notifications/NotificationsLayout/PreferencesModal'
import { UnsubscribeModal } from './components/notifications/NotificationsLayout/UnsubscribeModal'
import AuthProtectedPage from './components/utils/AuthProtectedPage'
import W3iContext from './contexts/W3iContext/context'
import { useMobileResponsiveGrid, useModals } from './utils/hooks'
import { signatureModalService } from './utils/store'
import { truncate } from './utils/string'
import { SignatureModal } from './pages/Login/SignatureModal'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'

const App = () => {
  const { chatClientProxy, userPubkey, uiEnabled, registeredKey, registerMessage } =
    useContext(W3iContext)
  const {
    isProfileModalOpen,
    isShareModalOpen,
    isPreferencesModalOpen,
    isUnsubscribeModalOpen,
    isSignatureModalOpen,
    isContactModalOpen
  } = useModals()

  const ref = useMobileResponsiveGrid()

  useEffect(() => {
    const messageEventListener = (
      messageEvent: ChatClientTypes.BaseEventArgs<ChatClientTypes.Message>
    ) => {
      /*
       * We can't use hooks like `useLocation` or `useParam` to prevent
       * constantly reregistering the listener.
       */
      const peer = new URLSearchParams(window.location.search).get('peer')
      if (!peer || peer !== messageEvent.params.authorAccount) {
        navigator.serviceWorker.getRegistration().then(swRegistration => {
          swRegistration?.showNotification(truncate(messageEvent.params.authorAccount, 6), {
            body: messageEvent.params.message
          })
        })
      }
    }

    if (!chatClientProxy) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }

    const sub = chatClientProxy.observe('chat_message', { next: messageEventListener })

    return () => {
      sub.unsubscribe()
    }
  }, [chatClientProxy])

  useEffect(() => {
    if (userPubkey && !registeredKey && registerMessage) {
      signatureModalService.openModal()
    } else {
      signatureModalService.closeModal()
    }
  }, [userPubkey, registeredKey, registerMessage])

  return (
    <AuthProtectedPage>
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.1 }}
          ref={ref}
          className="App"
        >
          {chatClientProxy && (
            <Fragment>
              {uiEnabled.sidebar ? <Sidebar /> : null}
              <Outlet />
              <ToastContainer />
              <AnimatePresence mode="wait">
                {isProfileModalOpen && <Profile />}
                {isShareModalOpen && <Share />}
                {isPreferencesModalOpen && <PreferencesModal />}
                {isUnsubscribeModalOpen && <UnsubscribeModal />}
                {isSignatureModalOpen && registerMessage && (
                  <SignatureModal message={registerMessage} />
                )}
              </AnimatePresence>
            </Fragment>
          )}
        </m.div>
      </LazyMotion>
    </AuthProtectedPage>
  )
}

export default App
