import React from 'react'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { arbitrum, avalanche, bsc, mainnet, polygon } from 'wagmi/chains'

import LaunchBanner from '@/components/general/LaunchBanner'
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/web3Modal'
import SettingsContextProvider from '@/contexts/SettingsContext'
import W3iContextProvider from '@/contexts/W3iContext'
import ConfiguredRoutes from '@/routes'
import { polyfill } from '@/utils/polyfill'
import { initSentry } from '@/utils/sentry'

import { Modals } from './Modals'

import './index.css'

polyfill()
initSentry()

const projectId = import.meta.env.VITE_PROJECT_ID
const chains = [mainnet, arbitrum, polygon, avalanche, bsc]

const metadata = {
  name: 'Web3Inbox',
  description: 'Notification Hub',
  url: 'https://app.web3inbox.com',
  icons: ['https://app.web3inbox.com/logo.png']
}
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  wagmiConfig,
  enableAnalytics: import.meta.env.PROD,
  chains,
  projectId,
  themeMode: 'light',
  themeVariables: { '--w3m-z-index': 9999 },
  termsConditionsUrl: TERMS_OF_SERVICE_URL,
  privacyPolicyUrl: PRIVACY_POLICY_URL
})

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <SettingsContextProvider>
        <BrowserRouter>
          <W3iContextProvider>
            <LaunchBanner />
            <ConfiguredRoutes />
            <Modals />
          </W3iContextProvider>
        </BrowserRouter>
      </SettingsContextProvider>
    </WagmiConfig>
  </React.StrictMode>
)
