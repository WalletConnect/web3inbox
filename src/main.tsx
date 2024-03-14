import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initWeb3InboxClient } from '@web3inbox/react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import pino from 'pino'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'

import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/web3Modal'
import SettingsContextProvider from '@/contexts/SettingsContext'
import W3iContextProvider from '@/contexts/W3iContext'
import ConfiguredRoutes from '@/routes'
import { polyfill } from '@/utils/polyfill'
import { initSentry } from '@/utils/sentry'
import { metadata, wagmiConfig } from '@/utils/wagmiConfig'

import { Modals } from './Modals'
import DevTimeStamp from './components/dev/DevTimeStamp'
import { ArrayLogStream } from './utils/blobLogger'

import './index.css'

polyfill()
initSentry()

const logStream = new ArrayLogStream()

const projectId = import.meta.env.VITE_PROJECT_ID

createWeb3Modal({
  wagmiConfig,
  enableAnalytics: import.meta.env.PROD,
  projectId,
  termsConditionsUrl: TERMS_OF_SERVICE_URL,
  privacyPolicyUrl: PRIVACY_POLICY_URL,
  themeMode: 'light',
  themeVariables: { '--w3m-z-index': 9999 },
  metadata
})

initWeb3InboxClient({
  projectId,
  allApps: true,
  domain: window.location.hostname,
  logger: pino({
    level: 'debug',
    browser: {
      write: chunk => {
        logStream.write(chunk)
      }
    }
  })
})

const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SettingsContextProvider>
          <BrowserRouter>
            <W3iContextProvider>
              <ConfiguredRoutes />
              <DevTimeStamp />
              <Modals />
            </W3iContextProvider>
          </BrowserRouter>
        </SettingsContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
    <Toaster
      toastOptions={{
        position: 'bottom-right',
        duration: 5000,
        style: {
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '1em'
        }
      }}
    />
  </React.StrictMode>
)
