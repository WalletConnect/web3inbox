import { useWeb3Modal } from '@web3modal/react'
import Wallet from '../../general/Icon/Wallet'
import './ConnectWalletButton.scss'

const ConnectWalletButton: React.FC = () => {
  const { open } = useWeb3Modal()

  return (
    <>
      <button
        onClick={() => {
          open()
        }}
        className="ConnectWalletButton"
      >
        <Wallet />
      </button>
    </>
  )
}

export default ConnectWalletButton
