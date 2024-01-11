/* eslint-disable no-nested-ternary */
import { useContext } from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import App from '@/App'
import AppExplorer from '@/components/notifications/AppExplorer'
import AppNotifications from '@/components/notifications/AppNotifications'
import NotificationsLayout from '@/components/notifications/NotificationsLayout'
import AppearanceSettings from '@/components/settings/AppearanceSettings'
import NotificationsSettings from '@/components/settings/NotificationsSettings'
import SettingsLayout from '@/components/settings/SettingsLayout'
import W3iContext from '@/contexts/W3iContext/context'
import Login from '@/pages/Login'
import ScanQrCode from '@/pages/ScanQrCode'
import WidgetConnect from '@/pages/widget/Connect'
import WidgetSubscribe from '@/pages/widget/Subscribe'

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
          <Route path="/notifications" element={<NotificationsLayout />}>
            <Route path="/notifications/new-app" element={<AppExplorer />} />
            <Route path="/notifications/:topic" element={<AppNotifications />} />
          </Route>
        ) : null}
        {uiEnabled.settings ? (
          <Route path="settings" element={<SettingsLayout />}>
            <Route path="/settings/appearance" element={<AppearanceSettings />} />
            <Route path="/settings/notification" element={<NotificationsSettings />} />
            {/* <Route path="/settings/privacy" element={<PrivacySettings />} /> */}
          </Route>
        ) : null}
      </Route>

      <Route index element={<Navigate to={defaultPage} />} />

      <Route path="widget">
        <Route path="/widget/subscribe" element={<WidgetSubscribe />} />
        <Route path="/widget/connect" element={<WidgetConnect />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default ConfiguredRoutes
