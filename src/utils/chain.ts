export const EIPNumberPrefix = 'eip155:'

/**
 * Returns the chain string combined with EIP number with the given chainId
 * @param chainId - chain number
 * @returns string
 */
export const getEIPChainString = (chainId?: number) => {
  if (!chainId) {
    return undefined
  }

  return EIPNumberPrefix.concat(chainId?.toString() || '')
}
