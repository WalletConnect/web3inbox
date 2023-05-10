import { isAddress } from '@ethersproject/address'

export const getEthChainAddress = (address: string) => {
  return address.split(':')[2] as `0x${string}`
}

export const formatEthChainsAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  return `eip155:1:${address}`
}

export const isValidEnsDomain = (domain: string) => {
  return /[A-z][A-z]*.eth$/u.test(domain)
}

export const isValidAddressOrEnsDomain = (stringToTest: string) => {
  return isValidEnsDomain(stringToTest) || isAddress(stringToTest)
}
