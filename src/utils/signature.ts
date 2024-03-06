import { getBytecode } from '@wagmi/core'

import { wagmiConfig } from './wagmiConfig'

export const isSmartContractWallet = async (address: `0x${string}`) => {
  const bytecode = await getBytecode(wagmiConfig, {
    address
  })

  const nonContractBytecode =
    !bytecode || bytecode === '0x' || bytecode === '0x0' || bytecode === '0x00'

  return !nonContractBytecode
}
