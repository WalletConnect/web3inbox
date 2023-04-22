import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
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
import SettingsContextProvider from './contexts/SettingsContext'
import W3iContextProvider from './contexts/W3iContext'
import './index.css'
import Login from './pages/Login'
import './styles/fonts.css'
import { AnimatePresence } from 'framer-motion'
import ScanQrCode from './pages/ScanQrCode'
import DirectInvite from './components/messages/DirectInvite'

const projectId = import.meta.env.VITE_PROJECT_ID

const chains = [mainnet, polygon, optimism, arbitrum]
const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains, version: 2 }),
  provider
})
export const ethereumClient = new EthereumClient(wagmiClient, chains)

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <SettingsContextProvider>
        <BrowserRouter>
          <W3iContextProvider>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/qrcode-scan" element={<ScanQrCode />} />

                <Route path="/" element={<App />}>
                  <Route path="notifications" element={<NotificationsLayout />}>
                    <Route index element={<Web3InboxPlaceholder />} />
                    <Route path="/notifications/new-app" element={<AppExplorer />} />
                    <Route path="/notifications/:topic" element={<AppNotifications />} />
                  </Route>
                  <Route path="messages" element={<MessagesLayout />}>
                    <Route index element={<Web3InboxPlaceholder />} />
                    <Route path="/messages/chat/:peer" element={<ThreadWindow />} />
                    <Route path="/messages/new-chat" element={<NewChat />} />
                    <Route path="/messages/chat-invites" element={<ChatInvites />} />
                    <Route path="/messages/invite/:account" element={<DirectInvite />} />
                  </Route>
                  <Route path="settings" element={<SettingsLayout />}>
                    <Route index element={<Settings />} />
                  </Route>
                </Route>

                <Route index element={<Navigate to={`/messages`} />} />
              </Routes>
            </AnimatePresence>
          </W3iContextProvider>
        </BrowserRouter>
      </SettingsContextProvider>
    </WagmiConfig>
    <Web3Modal
      ethereumClient={ethereumClient}
      projectId={import.meta.env.VITE_PROJECT_ID}
    ></Web3Modal>
  </React.StrictMode>
)
