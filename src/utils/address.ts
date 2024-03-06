import { isAddress } from '@ethersproject/address'

export const getEthChainAddress = (address?: string) => {
  if (!address) {
    return ''
  }

  return address.split(':')[2] as `0x${string}`
}

export const formatEthChainsAddress = (address?: string, chain?: string) => {
  if (!address || !chain) {
    return ''
  }

  return `${chain}:${address}`
}

export const isValidEnsDomain = (domain: string) => {
  return /[A-z][A-z]*.eth$/u.test(domain)
}

export const isValidAddressOrEnsDomain = (stringToTest: string) => {
  return isValidEnsDomain(stringToTest) || isAddress(stringToTest)
}

export const getChain = (address: string) => {
  return address.split(':').slice(0, 2).join(':')
}
