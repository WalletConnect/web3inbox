import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import SettingsContextProvider from './contexts/SettingsContext'
import W3iContextProvider from './contexts/W3iContext'
import './index.css'
import './styles/fonts.css'
import { AnimatePresence } from 'framer-motion'
import ConfiguredRoutes from './routes'

const projectId = import.meta.env.VITE_PROJECT_ID

const chains = [mainnet, polygon, optimism, arbitrum]
const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains, version: 1 }),
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
            <AnimatePresence mode="wait"></AnimatePresence>
            <ConfiguredRoutes />
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
