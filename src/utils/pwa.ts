export const isInstalledOnHomeScreen = window.matchMedia('(display-mode: standalone)').matches

export const isMobileBrowser = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent)

/**
 * WARN: Browser check can be tricky and not reliable at some cases.
 * Some non-Safari browsers can return the same `userAgent` value as Safari, so it might not be quite possible to detect if the browser is Safari or not.
 * There are several fields like `vendor` (deprecated), `userAgent`, `userAgentData`. Some of these are deprecated and some are returning similar values across different browsers like `userAgent`.
 * So be aware that is not perfect solution.
 */
export const isNonSafari = /CriOS|FxiOS/i.test(navigator.userAgent)

export const isMobileButNotInstalledOnHomeScreen = isMobileBrowser && !isInstalledOnHomeScreen
