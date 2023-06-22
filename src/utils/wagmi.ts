import { ONE_MONTH, readCookie, setCookie } from './cookies'

export const storeWagmiInfoInCookie = () => {
  const wagmiInfo = {
    'wagmi.store': localStorage.getItem('wagmi.store'),
    'wagmi.injected.shimDisconnect': localStorage.getItem('wagmi.injected.shimDisconnect'),
    'wagmi.wallet': localStorage.getItem('wagmi.wallet'),
    'wagmi.connected': localStorage.getItem('wagmi.connected')
  }

  setCookie({
    key: 'wagmiRestore',
    maxAgeSeconds: ONE_MONTH,
    samesite: 'None',
    value: JSON.stringify(wagmiInfo)
  })
}

export const recoverWagmiInfoFromCookie = () => {
  const wagmiRestoreRaw = readCookie('wagmiRestore')
  if (wagmiRestoreRaw) {
    const wagmiRestore = JSON.parse(wagmiRestoreRaw) as Record<string, string>
    Object.entries(wagmiRestore).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })
    document.location.reload()
  }
}
