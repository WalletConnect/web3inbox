import { deleteCookie, ONE_MONTH, readCookie, setCookie } from './cookies'

const WAGMI_INFO = 'wagmiInfo'

export const storeWagmiInfoInCookie = (metadata?: Record<string, unknown>) => {
  const wagmiKeys = [
    'wagmi.store',
    'wagmi.injected.shimDisconnect',
    'wagmi.wallet',
    'wagmi.connected'
  ]

  const wagmiInfo = Object.fromEntries(wagmiKeys.map(key => [key, localStorage.getItem(key)]))

  setCookie({
    key: WAGMI_INFO,
    maxAgeSeconds: ONE_MONTH,
    samesite: 'None',
    value: JSON.stringify({ ...wagmiInfo, metadata: JSON.stringify(metadata) })
  })
}

export const recoverWagmiInfoFromCookie = () => {
  console.log('1Cookie1 Attempting to recover: ', document.cookie)
  const wagmiRestoreRaw = readCookie(WAGMI_INFO)
  if (wagmiRestoreRaw) {
    const wagmiRestore = JSON.parse(wagmiRestoreRaw) as Record<string, string>
    console.log('Recovering using ', wagmiRestore)
    Object.entries(wagmiRestore).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })
    document.location.reload()
  }
}

export const deleteWagmiInfoFromCookies = () => {
  deleteCookie(WAGMI_INFO)
}
