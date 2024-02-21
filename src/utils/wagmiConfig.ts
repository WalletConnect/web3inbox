import { arbitrum, avalanche, bsc, mainnet, polygon } from '@wagmi/core/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi'

const projectId = import.meta.env.VITE_PROJECT_ID

export const metadata = {
  name: 'Web3Inbox',
  description: 'Web3Inbox App',
  url: 'https://app.web3inbox.com',
  icons: ['https://assets.web3inbox.com/images/w3i-app-logo.png']
}

export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum, polygon, avalanche, bsc],
  projectId,
  metadata,
  enableEmail: true
})
