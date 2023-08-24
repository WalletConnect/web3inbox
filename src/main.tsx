import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import SettingsContextProvider from './contexts/SettingsContext'
import W3iContextProvider from './contexts/W3iContext'
import './index.css'
import './styles/fonts.css'
import { AnimatePresence } from 'framer-motion'
import ConfiguredRoutes from './routes'
import { Modals } from './Modals'
import Sentry from '@sentry/react'

Sentry.init({
  dsn: 'https://96f54440c19eb6650fd5a502de09a306@o1095249.ingest.sentry.io/4505754150043648',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        'localhost',
        'https://keys.walletconnect.com',
        'https://history.walletconnect.com',
        'https://web3inbox-dev-hidden.vercel.app'
      ]
    }),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.5,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

const projectId = import.meta.env.VITE_PROJECT_ID

const chains = [mainnet, polygon, optimism, arbitrum]
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})

export const ethereumClient = new EthereumClient(wagmiConfig, chains)

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
    <Web3Modal
      ethereumClient={ethereumClient}
      projectId={import.meta.env.VITE_PROJECT_ID}
    ></Web3Modal>
  </React.StrictMode>
)
