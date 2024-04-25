import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initWeb3InboxClient } from '@web3inbox/react'
import { createSIWEConfig, formatMessage, getAddressFromMessage, getChainIdFromMessage, SIWEVerifyMessageArgs } from '@web3modal/siwe'
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

import { getAccount } from '@wagmi/core'
import { signatureModalService } from './utils/store'

polyfill()
initSentry()

let client: Web3InboxClient | null = null;

const projectId = import.meta.env.VITE_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is required')
}

const verifySiweMessage = async (params: SIWEVerifyMessageArgs) => {
    if(!client) {
      throw new Error("Failed to verify message - no client")
    }

    if(!registerParams) {
      throw new Error("Failed to verify message - no registerParams saved")
    }

    // Start signing the signature modal so it does not show up
    // in sign 2.5
    signatureModalService.startSigning()

    const account = `${getChainIdFromMessage(params.message)}:${getAddressFromMessage(params.message)}`

    if ( await client.getAccountIsRegistered(account) ) {
      return true;
    }

    // Unregister account if registered with a faulty registration.
    try { await client.unregister({ account }) } catch(e) {}

    await client.register({
      registerParams: {
	allApps: true,
	cacaoPayload: {
	  aud: registerParams.cacaoPayload.aud,
	  domain: registerParams.cacaoPayload.domain,
	  iat: registerParams.cacaoPayload.iat,
	  nonce: registerParams.cacaoPayload.nonce,
	  version: registerParams.cacaoPayload.version,
	  iss: account,
	  resources: registerParams.cacaoPayload.resources,
	  ...params.cacao?.p
	},
	privateIdentityKey: registerParams.privateIdentityKey
	
      },
      signature: params.signature
    })


    return true
}

let registerParams: Awaited<ReturnType<Web3InboxClient['prepareRegistrationViaRecaps']>> | null = null;

const siweConfig = createSIWEConfig({
  getMessageParams: async () => {
    if(!client) {
      throw new Error("Client not ready yet")
    }

    registerParams = await client.prepareRegistrationViaRecaps({
      domain: window.location.hostname,
      allApps: true
    })

    const { cacaoPayload } = registerParams;

    // Start signing the signature modal so it does not show up
    // in sign 2.5
    signatureModalService.setSign25ModeOn()

    return {
      chains: wagmiConfig.chains.map(chain => chain.id),
      domain: cacaoPayload.domain,
      statement: cacaoPayload.statement ?? undefined,
      uri: cacaoPayload.uri,
      resources: cacaoPayload.resources,
    }
  },
  createMessage: ({ address, ...args}) => formatMessage(args, address),
  enabled: true,
  getSession: async () => {
    console.log(">>> getSession")

    const { address, chainId } = getAccount({ ...wagmiConfig })

    console.log(">>> getSession > returning", { address ,chainId })

    if(!(address && chainId)) return null;

    return {
      address,
      chainId
    }
  },
  getNonce: async () => {
    console.log(">>> getNonce")
    return registerParams?.cacaoPayload.nonce ?? "FAILED_NONCE";
  },
  signOut: () => Promise.resolve(false),
  verifyMessage: async (params) => {
    signatureModalService.setSign25ModeOn()
    try {
      const messageIsValid = await verifySiweMessage(params);
      if (!messageIsValid) signatureModalService.setSign25ModeOff() 

      return messageIsValid;
    }
    catch {
      signatureModalService.setSign25ModeOff()
      return false
    }
  }
})

createWeb3Modal({
  wagmiConfig,
  enableAnalytics: import.meta.env.PROD,
  projectId,
  termsConditionsUrl: TERMS_OF_SERVICE_URL,
  privacyPolicyUrl: PRIVACY_POLICY_URL,
  themeMode: 'light',
  enableWalletFeatures: true,
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
