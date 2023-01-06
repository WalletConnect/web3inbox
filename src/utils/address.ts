export const getEthChainAddress = (address: string) => {
  return address.split(':')[2] as `0x${string}`
}

export const formatEthChainsAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  return `eip155:1:${address}`
}
