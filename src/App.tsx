import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.scss'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AuthProtectedPage from './components/utils/AuthProtectedPage'
import ChatContext from './contexts/ChatContext/context'

const App = () => {
  const { chatClient } = useContext(ChatContext)

  console.log('send message')
  navigator.serviceWorker.ready.then(() => {
    console.log({ controller: navigator.serviceWorker.controller })
    navigator.serviceWorker.controller?.postMessage({
      type: 'MESSAGE_RECEIVED',
      author: 'SOME AUTHOR',
      message: 'MESSAGE'
    })
  })

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    if (!chatClient) {
      return
    }

    chatClient.on('chat_message', messageEvent => {
      console.log('sending message event')

      navigator.serviceWorker.controller?.postMessage({
        type: 'MESSAGE_RECEIVED',
        author: messageEvent.params.authorAccount,
        message: messageEvent.params.message
      })
    })
  }, [chatClient])

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
