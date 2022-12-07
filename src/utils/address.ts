export const getEthChainAddress = (address: string) => {
  return address.split(':')[2] as `0x${string}`
}
