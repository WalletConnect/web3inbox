export const EIPNumberPrefix = 'eip155:'

/**
 * Returns the chain string combined with EIP number with the given chainId
 * @param chainId - chain number
 * @returns string
 */
export const getChainString = (chainId?: number) => {
  return EIPNumberPrefix.concat(chainId?.toString() || '')
}
