import { useWeb3Modal } from '@web3modal/wagmi/react'

import Wallet from '@/components/general/Icon/Wallet'

import './ConnectWalletButton.scss'

const ConnectWalletButton: React.FC = () => {
  const modal = useWeb3Modal()

  return (
    <>
      <button
        onClick={() => {
          modal.open()
        }}
        className="ConnectWalletButton"
      >
        <Wallet />
      </button>
    </>
  )
}

export default ConnectWalletButton
