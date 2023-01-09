import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import './index.css'
import './styles/fonts.css'
import ChatContextProvider from './contexts/ChatContext'
import { Web3Modal } from '@web3modal/react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import MessagesLayout from './components/messages/MessagesLayout'
import NotificationsLayout from './components/notifications/NotificationsLayout'
import ThreadWindow from './components/messages/ThreadWindow'
import UserContextProvider from './contexts/UserContext'

const projectId = import.meta.env.VITE_PROJECT_ID

const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum]
const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider
})
export const ethereumClient = new EthereumClient(wagmiClient, chains)

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <ChatContextProvider>
        <UserContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<App />}>
                <Route path="notifications" element={<NotificationsLayout />} />
                <Route path="messages" element={<MessagesLayout />}>
                  <Route path="/messages/chat/:peer" element={<ThreadWindow />} />
                </Route>
              </Route>

              <Route index element={<Navigate to="/messages" />} />
            </Routes>
          </BrowserRouter>
        </UserContextProvider>
      </ChatContextProvider>
    </WagmiConfig>
    <Web3Modal
      ethereumClient={ethereumClient}
      projectId={import.meta.env.VITE_PROJECT_ID}
    ></Web3Modal>
  </React.StrictMode>
)
