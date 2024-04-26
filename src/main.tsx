import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getAccount } from '@wagmi/core'
import { composeDidPkh } from '@walletconnect/did-jwt'
import { Web3InboxClient } from '@web3inbox/core'
import { initWeb3InboxClient } from '@web3inbox/react'
import {
  SIWEVerifyMessageArgs,
  createSIWEConfig,
  formatMessage,
  getAddressFromMessage,
  getChainIdFromMessage
} from '@web3modal/siwe'
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
import { waitFor } from './utils/general'

polyfill()
initSentry()

let client: Web3InboxClient | null = null

const projectId = import.meta.env.VITE_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is required')
}

const verifySiweMessage = async (params: SIWEVerifyMessageArgs) => {
  if (!client) {
    throw new Error('Failed to verify message - no client')
  }

  if (!registerParams) {
    throw new Error('Failed to verify message - no registerParams saved')
  }

  // Start signing the signature modal so it does not show up
  // in sign 2.5
  const account = composeDidPkh(
    `${getChainIdFromMessage(params.message)}:${getAddressFromMessage(params.message)}`
  )

  if (await client.getAccountIsRegistered(account)) {
    return true
  }

  // Unregister account if registered with a faulty registration.
  try {
    await client.unregister({ account })
  } catch (e) {}

  console.log({ registerParams, paramsCacao: params.cacao?.p })

  await client.register({
    registerParams: {
      allApps: true,
      cacaoPayload: {
        ...registerParams.cacaoPayload,
        ...params.cacao?.p,
        iss: account
      },
      privateIdentityKey: registerParams.privateIdentityKey
    },
    signature: params.signature
  })

  return true
}

let registerParams: Awaited<ReturnType<Web3InboxClient['prepareRegistrationViaRecaps']>> | null =
  null
let verifyingMessage = false;

const siweConfig = createSIWEConfig({
  getMessageParams: async () => {
    if (!client) {
      throw new Error('Client not ready yet')
    }

    registerParams = await client.prepareRegistrationViaRecaps({
      domain: window.location.hostname,
      allApps: true
    })

    const { cacaoPayload } = registerParams

    return {
      chains: wagmiConfig.chains.map(chain => chain.id),
      domain: cacaoPayload.domain,
      statement: cacaoPayload.statement ?? undefined,
      uri: cacaoPayload.uri,
      resources: cacaoPayload.resources
    }
  },
  createMessage: ({ address, ...args }) => {
    if (!registerParams) {
      throw new Error("Can't create message if registerParams is undefined")
    }

    registerParams = {
      ...registerParams,
      cacaoPayload: {
        ...registerParams?.cacaoPayload,
        ...args
      }
    }

    const message = formatMessage(registerParams.cacaoPayload, address)

    // statement is generated in format message and not part of original payload.
    const statement = message.split('\n')[3]
    registerParams.cacaoPayload.statement = statement

    console.log(
      '>>> formatted message',
      message,
      'with params',
      registerParams.cacaoPayload,
      'and overrides',
      args
    )

    return message
  },
  getNonce: async () => {
    console.log('>>> getNonce')
    return registerParams?.cacaoPayload.nonce ?? 'FAILED_NONCE'
  },
  getSession: async () => {
    await waitFor(async () => !!client)

    if(verifyingMessage) {
      await waitFor(async () => !verifyingMessage)
    }

    console.log('>>> getSession')

    const { address, chainId } = getAccount({ ...wagmiConfig })

    const account = `eip155:${chainId}:${address}`
    console.log('>>> getSession for account', account)

    const identityKey = await client?.getAccountIsRegistered(account)


    const invalidSession = !(address && chainId && identityKey);

    console.log('>>> getSession > returning', { address, chainId, identityKey }, { invalidSession })

    if (invalidSession) return null

    return {
      address,
      chainId,
    }
  },
  verifyMessage: async params => {
    try {
      verifyingMessage = true;
      console.log(">>>>>>>>> OOOOOOOOOOOOOOOOOOOO verifying")
      const messageIsValid = await verifySiweMessage(params)

      const account = `${getChainIdFromMessage(params.message)}:${getAddressFromMessage(params.message)}`;

      console.log(">>>>>>>>> [][][][]", { messageIsValid })

      if(messageIsValid) {
	await waitFor(() => client!.getAccountIsRegistered(account))
      }

      verifyingMessage = false;

      console.log(">>>>>> [][][][] ABSOLUTELY RETURNING, NOT THROWING", { messageIsValid })
      
      return messageIsValid
    } catch (e) {
      console.log(">>>>>>>>> [][][][] verifying failed", e)
      verifyingMessage = false;
      return false
    }
  },
  signOut: () => Promise.resolve(true),
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
}).then(w3iClient => (client = w3iClient))

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
