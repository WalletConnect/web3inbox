import App from './App'
import Web3InboxPlaceholder from './components/general/Web3InboxPlaceholder'
import ChatInvites from './components/messages/ChatInvites'
import MessagesLayout from './components/messages/MessagesLayout'
import NewChat from './components/messages/NewChat'
import ThreadWindow from './components/messages/ThreadWindow'
import AppExplorer from './components/notifications/AppExplorer'
import AppNotifications from './components/notifications/AppNotifications'
import NotificationsLayout from './components/notifications/NotificationsLayout'
import Settings from './components/settings/Settings'
import SettingsLayout from './components/settings/SettingsLayout'
import Login from './pages/Login'
import ScanQrCode from './pages/ScanQrCode'
import DirectInvite from './components/messages/DirectInvite'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useContext } from 'react'
import W3iContext from './contexts/W3iContext/context'
import WidgetSubscribe from './pages/widget/Subscribe'
import WidgetConnect from './pages/widget/Connect'

const ConfiguredRoutes: React.FC = () => {
  const { uiEnabled } = useContext(W3iContext)

  const defaultPage =
    Object.entries({
      '/messages': uiEnabled.chat,
      '/notifications': uiEnabled.notify,
      '/settings': uiEnabled.settings
    }).find(([_, enabled]) => enabled)?.[0] ?? '/login'

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/qrcode-scan" element={<ScanQrCode />} />

      <Route path="/" element={<App />}>
        {uiEnabled.notify ? (
          <Route path="notifications" element={<NotificationsLayout />}>
            <Route index element={<AppExplorer />} />
            <Route path="/notifications/new-app" element={<AppExplorer />} />
            <Route path="/notifications/:topic" element={<AppNotifications />} />
          </Route>
        ) : null}
        {uiEnabled.chat ? (
          <Route path="messages" element={<MessagesLayout />}>
            <Route index element={<Web3InboxPlaceholder />} />
            <Route path="/messages/chat/:peer" element={<ThreadWindow />} />
            <Route path="/messages/new-chat" element={<NewChat />} />
            <Route path="/messages/chat-invites" element={<ChatInvites />} />
            <Route path="/messages/invite/:account" element={<DirectInvite />} />
          </Route>
        ) : null}
        {uiEnabled.settings ? (
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Settings />} />
          </Route>
        ) : null}
      </Route>

      <Route index element={<Navigate to={defaultPage} />} />

      <Route path="widget">
        <Route path="/widget/subscribe" element={<WidgetSubscribe />} />
        <Route path="/widget/connect" element={<WidgetConnect />} />
      </Route>
    </Routes>
  )
}

export default ConfiguredRoutes
