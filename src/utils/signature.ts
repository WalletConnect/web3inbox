import { signMessage as wagmiSignMessage } from '@wagmi/core'
import { getBytecode } from '@wagmi/core'

import { showErrorMessageToast } from './toasts'
import { wagmiConfig } from './wagmiConfig'

export const isSmartContractWallet = async (address: `0x${string}`) => {
  const bytecode = await getBytecode(wagmiConfig, {
    address
  })

  const nonContractBytecode =
    !bytecode || bytecode === '0x' || bytecode === '0x0' || bytecode === '0x00'

  return !nonContractBytecode
}

export const signMessage = async (message: string) => {
  try {
    const signed = await wagmiSignMessage(wagmiConfig, {
      message
    })

    return signed
  } catch (e: any) {
    showErrorMessageToast('Failed to sign message. Consider using different wallet.')
    throw new Error(`Failed to sign message. ${e.message}`)
  }
}
