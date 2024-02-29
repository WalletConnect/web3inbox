/* eslint-disable no-nested-ternary */
import { Navigate, Route, Routes } from 'react-router-dom'

import App from '@/App'
import AppExplorer from '@/components/notifications/AppExplorer'
import AppNotifications from '@/components/notifications/AppNotifications'
import NotificationsLayout from '@/components/notifications/NotificationsLayout'
import AppearanceSettings from '@/components/settings/AppearanceSettings'
import NotificationsSettings from '@/components/settings/NotificationsSettings'
import SettingsLayout from '@/components/settings/SettingsLayout'
import SupportSettings from '@/components/settings/SupportSettings'
import Login from '@/pages/Login'
import ScanQrCode from '@/pages/ScanQrCode'

const ConfiguredRoutes: React.FC = () => {
  const defaultPage = '/notifications'

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/qrcode-scan" element={<ScanQrCode />} />

      <Route path="/" element={<App />}>
        <Route path="/notifications" element={<NotificationsLayout />}>
          <Route path="/notifications/new-app" element={<AppExplorer />} />
          <Route path="/notifications/:topic" element={<AppNotifications />} />
        </Route>
        <Route path="settings" element={<SettingsLayout />}>
          <Route path="/settings/appearance" element={<AppearanceSettings />} />
          <Route path="/settings/notification" element={<NotificationsSettings />} />
          <Route path="/settings/support" element={<SupportSettings />} />
        </Route>
      </Route>

      <Route index element={<Navigate to={defaultPage} />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default ConfiguredRoutes
