import { detect } from 'detect-browser'

const browser = detect()

export const isInstalledOnHomescreen = () => {
  // on Android and iOS, display mode is set to
  // standalone when the app is opened from home screen
  const displayIsStandalone = window.matchMedia('(display-mode: standalone)').matches

  return displayIsStandalone
}

export const isMobileBrowser = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent)

export const isChrome = () =>
  browser?.name ? /chrome|crios|edge-chromium/i.test(browser?.name) : false

export const isMobileButNotInstalledOnHomeScreen = () =>
  isMobileBrowser() && !isInstalledOnHomescreen()
