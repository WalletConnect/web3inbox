import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initWeb3InboxClient } from '@web3inbox/react'
import { createSIWEConfig, formatMessage, getAddressFromMessage, getChainIdFromMessage } from '@web3modal/siwe'
import { createWeb3Modal } from '@web3modal/wagmi/react'
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

import './index.css'
import { Web3InboxClient } from '@web3inbox/core'

import { getAccount, disconnect } from '@wagmi/core'

polyfill()
initSentry()

let client: Web3InboxClient | null = null;

const projectId = import.meta.env.VITE_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is required')
}

let registerParams: Awaited<ReturnType<Web3InboxClient['prepareRegistrationViaRecaps']>> | null = null;

const siweConfig = createSIWEConfig({
  getMessageParams: async () => {
    if(!client) {
      throw new Error("Client not ready yet")
    }

    const account = getAccount(wagmiConfig)

    registerParams = await client.prepareRegistrationViaRecaps({
      domain: window.location.hostname,
      recapObject: {
	att: {
	  "https://notify.walletconnect.com": {
	    "manage/all-apps-notifications": [{}]
	  }
	}
      }
    })

    const { cacaoPayload } = registerParams;

    return {
      chains: [account.chainId ?? 1],
      domain: cacaoPayload.domain,
      statement: cacaoPayload.statement ?? undefined,
      uri: cacaoPayload.uri,
      resources: cacaoPayload.resources,
    }
  },
  createMessage: ({ address, ...args}) => formatMessage(args, address),
  getSession: async () => {
    const { address, chainId } = getAccount({ ...wagmiConfig })

    if(!(address && chainId)) {
      throw new Error("Failed to get session")
    }

    return {
      address,
      chainId
    }
  },
  getNonce: async () => {
    return registerParams?.cacaoPayload.nonce ?? "FAILED_NONCE";
  },
  signOut: async () => {
    try {
      await disconnect(wagmiConfig)
      return true;
    }
    catch (e) {
      return false;
    }
  },
  verifyMessage: async (params) => {
    if(!client) {
      throw new Error("Failed to verify message - no client")
    }

    if(!registerParams) {
      throw new Error("Failed to verify message - no registerParams saved")
    }

    const account = `eip155:${getChainIdFromMessage(params.message)}:${getAddressFromMessage(params.message)}`

    console.log({message: params.message}, "<<<<")

    await client.register({
      registerParams: {
	cacaoPayload: {
	  aud: registerParams.cacaoPayload.aud,
	  domain: registerParams.cacaoPayload.domain,
	  iat: registerParams.cacaoPayload.iat,
	  nonce: registerParams.cacaoPayload.nonce,
	  version: registerParams.cacaoPayload.version,
	  iss: account,
	  resources: registerParams.cacaoPayload.resources,
	  statement: registerParams.cacaoPayload.statement ?? undefined,
	},
	privateIdentityKey: registerParams.privateIdentityKey
      },
      signature: params.signature
    })
    
    return true
  }
})

createWeb3Modal({
  wagmiConfig,
  enableAnalytics: import.meta.env.PROD,
  projectId,
  termsConditionsUrl: TERMS_OF_SERVICE_URL,
  privacyPolicyUrl: PRIVACY_POLICY_URL,
  themeMode: 'light',
  siweConfig,
  themeVariables: { '--w3m-z-index': 9999 },
  metadata
})

initWeb3InboxClient({
  projectId,
  allApps: true,
  domain: window.location.hostname,
  logLevel: import.meta.env.PROD ? 'error' : import.meta.env.NEXT_PUBLIC_LOG_LEVEL || 'debug'
}).then(w3iClient => client = w3iClient)

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
