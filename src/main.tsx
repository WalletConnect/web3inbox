import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import SettingsContextProvider from './contexts/SettingsContext'
import W3iContextProvider from './contexts/W3iContext'
import './index.css'
import './styles/fonts.css'
import { AnimatePresence } from 'framer-motion'
import ConfiguredRoutes from './routes'
import { Modals } from './Modals'
import { initSentry } from './utils/sentry'
import { polyfill } from './utils/polyfill'
import { walletConnectProvider } from '@web3modal/wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { createWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react'

polyfill()
initSentry()

const projectId = import.meta.env.VITE_PROJECT_ID

const { chains, publicClient } = configureChains([mainnet], [walletConnectProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ options: { projectId, showQrModal: false } }),
    new InjectedConnector({ options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ options: { appName: 'Web3Inbox' } })
  ],
  publicClient
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'light',
  themeVariables: { '--w3m-z-index': '9999' }
})

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <SettingsContextProvider>
        <BrowserRouter>
          <W3iContextProvider>
            <AnimatePresence mode="wait"></AnimatePresence>
            <ConfiguredRoutes />
            <Modals />
          </W3iContextProvider>
        </BrowserRouter>
      </SettingsContextProvider>
    </WagmiConfig>
  </React.StrictMode>
)
