export const isInstalledOnHomeScreen = window.matchMedia('(display-mode: standalone)').matches

export const isMobileBrowser = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent)

export const isNonSafari = /CriOS|FxiOS/i.test(navigator.userAgent)

/**
 * It's not possible to detect Safari on iOS. `navigator` object doesn't have enough information to detect if the running browser is exactly Safari.
 * There are several fields like `vendor` (deprecated), `userAgent`, `userAgentData`. But these values can mislead us since they can return the same values for different browsers.
 * Instead of detecting Safari and doing conditional renderings with this value, prefer different solution.
 * Tested mobile browsers: Safari, Chrome, Firefox, Arc, Brave
 */
export const isSafari = isAppleMobile && navigator.userAgent.match(/Safari/i)

export const isMobileButNotInstalledOnHomeScreen = isMobileBrowser && !isInstalledOnHomeScreen
