import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { arbitrum, avalanche, bsc, mainnet, polygon } from 'wagmi/chains'
import SettingsContextProvider from './contexts/SettingsContext'
import W3iContextProvider from './contexts/W3iContext'
import './index.css'
import './styles/fonts.css'
import ConfiguredRoutes from './routes'
import { Modals } from './Modals'
import { initSentry } from './utils/sentry'
import { polyfill } from './utils/polyfill'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

polyfill()
initSentry()

const projectId = import.meta.env.VITE_PROJECT_ID
const chains = [mainnet, arbitrum, polygon, avalanche, bsc]

const metadata = {
  name: 'Web3Inbox',
  description: 'Notification Hub',
  url: 'https://app.web3inbox.com',
  icons: ['https://app.web3inbox.com/logo.svg']
}
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  wagmiConfig,
  enableAnalytics: process.env.NODE_ENV === 'production',
  chains,
  projectId,
  themeMode: 'light',
  themeVariables: { '--w3m-z-index': 9999 }
})

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <SettingsContextProvider>
        <BrowserRouter>
          <W3iContextProvider>
            <ConfiguredRoutes />
            <Modals />
          </W3iContextProvider>
        </BrowserRouter>
      </SettingsContextProvider>
    </WagmiConfig>
  </React.StrictMode>
)
