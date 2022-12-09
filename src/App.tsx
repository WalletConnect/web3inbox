import { useContext, useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import './App.scss'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AuthProtectedPage from './components/utils/AuthProtectedPage'
import ChatContext from './contexts/ChatContext/context'
import { truncate } from './utils/string'

const App = () => {
  const { chatClient } = useContext(ChatContext)
  const { peer } = useParams()

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    if (!chatClient) {
      return
    }

    chatClient.on('chat_message', messageEvent => {
      if (!peer || peer !== messageEvent.params.authorAccount) {
        navigator.serviceWorker.getRegistration().then(swRegistration => {
          swRegistration?.showNotification(truncate(messageEvent.params.authorAccount, 6), {
            body: messageEvent.params.message,
            timestamp: messageEvent.params.timestamp,
            silent: false,
            icon: `${window.location.origin}/logo.png`
          })
        })
      }
    })
  }, [chatClient, peer])

  return (
    <AuthProtectedPage>
      <div className="App">
        <Header />
        <Sidebar />
        <Outlet />
      </div>
    </AuthProtectedPage>
  )
}

export default App
