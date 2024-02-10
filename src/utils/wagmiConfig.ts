import { defaultWagmiConfig } from '@web3modal/wagmi'
import { arbitrum, avalanche, bsc, mainnet, polygon } from 'wagmi/chains'

const projectId = import.meta.env.VITE_PROJECT_ID

const metadata = {
  name: 'Web3Inbox',
  description: 'Notification Hub',
  url: 'https://app.web3inbox.com',
  icons: ['https://app.web3inbox.com/logo.png']
}

export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, arbitrum, polygon, avalanche, bsc],
  projectId,
  metadata,
  enableEmail: true
})
