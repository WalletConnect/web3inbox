export const isInstalledOnHomescreen = () => {
  // on Android and iOS, display mode is set to
  // standalone when the app is opened from home screen
  const displayIsStandalone = window.matchMedia('(display-mode: standalone)').matches

  return displayIsStandalone
}

export const isMobileBrowser = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const isMobileButNotInstalledOnHomescreen = () =>
  isMobileBrowser() && !isInstalledOnHomescreen()
