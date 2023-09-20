import type { ChatClientTypes } from '@walletconnect/chat-client'
import { Fragment, useContext, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.scss'
import Sidebar from './components/layout/Sidebar'
import AuthProtectedPage from './components/utils/AuthProtectedPage'
import W3iContext from './contexts/W3iContext/context'
import { useMobileResponsiveGrid } from './utils/hooks'
import { truncate } from './utils/string'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import MobileFooter from './components/layout/MobileFooter'

const App = () => {
  const { chatClientProxy, uiEnabled } = useContext(W3iContext)
  const location = useLocation()

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

  return (
    <AuthProtectedPage>
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.1 }}
          ref={ref}
          data-path={location.pathname}
          className="App"
        >
          {chatClientProxy && (
            <Fragment>
              {uiEnabled.sidebar ? <Sidebar isLoggedIn={true} /> : null}
              <Outlet />
              <AnimatePresence mode="wait"></AnimatePresence>
            </Fragment>
          )}
        </m.div>
      </LazyMotion>
      <MobileFooter />
      <Toaster
        toastOptions={{
          position: 'bottom-right',

          duration: 5000,
          style: {
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '1em'
          }
        }}
      />
    </AuthProtectedPage>
  )
}

export default App
