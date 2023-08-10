import 'react-toastify/dist/ReactToastify.css'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import { Fragment, useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import './App.scss'
import Sidebar from './components/layout/Sidebar'
import AuthProtectedPage from './components/utils/AuthProtectedPage'
import W3iContext from './contexts/W3iContext/context'
import { useMobileResponsiveGrid } from './utils/hooks'
import { truncate } from './utils/string'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'

const App = () => {
  const { chatClientProxy, uiEnabled } = useContext(W3iContext)

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
          className="App"
        >
          {chatClientProxy && (
            <Fragment>
              {uiEnabled.sidebar ? <Sidebar /> : null}
              <Outlet />
              <ToastContainer />
              <AnimatePresence mode="wait"></AnimatePresence>
            </Fragment>
          )}
        </m.div>
      </LazyMotion>
    </AuthProtectedPage>
  )
}

export default App
