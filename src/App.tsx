import type { ChatClientTypes } from '@walletconnect/chat-client'
import { Fragment, useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.scss'
import { Profile } from './components/account/Profile'
import { Share } from './components/account/Share/Share'
import Sidebar from './components/layout/Sidebar'
import AuthProtectedPage from './components/utils/AuthProtectedPage'
import W3iContext from './contexts/W3iContext/context'
import { useModals } from './utils/hooks'
import { truncate } from './utils/string'

const App = () => {
  const { chatClientProxy } = useContext(W3iContext)
  const { isProfileModalOpen, isShareModalOpen } = useModals()

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

    chatClientProxy.observe('chat_message', { next: messageEventListener })

    return () => {
      chatClientProxy.observe('chat_message', { next: messageEventListener })
    }
  }, [chatClientProxy])

  return (
    <AuthProtectedPage>
      <div className="App">
        {chatClientProxy && (
          <Fragment>
            <Sidebar />
            <Outlet />
            {isProfileModalOpen && <Profile />}
            {isShareModalOpen && <Share />}
          </Fragment>
        )}
      </div>
    </AuthProtectedPage>
  )
}

export default App
