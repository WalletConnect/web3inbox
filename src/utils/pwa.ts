export const isInstalledOnHomescreen = () => {
  // on Android and iOS, display mode is set to
  // standalone when the app is opened from home screen
  const displayIsStandalone = window.matchMedia('(display-mode: standalone)').matches

  return displayIsStandalone
}

export const isMobileBrowser = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const getMobilePlatform = () => {
  if (/Android/i.test(navigator.userAgent)) {
    return 'android' as const
  }
  if (/iPad|iPhone/i.test(navigator.userAgent)) {
    return 'ios' as const
  }
}

export const isMobileButNotInstalledOnHomescreen = () =>
  isMobileBrowser() && !isInstalledOnHomescreen()
