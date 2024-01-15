export const isInstalledOnHomeScreen = window.matchMedia('(display-mode: standalone)').matches

export const isMobileBrowser = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent)

/**
 * vendor is deprecated but it's the only way to detect if the browser is belongs to Apple product (Safari)
 * There are variety of browsers that are based on Chromium (Chrome, Arc, Brave, etc.) but `navigator` object doesn't provide a unique way to detect them.
 * `userAgent` or other fields doesn't give us ability to check if it's Safari or not.
 * So, we need to check the vendor to make sure that the browser is Safari to make conditional rendering.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vendor
 */
const isAppleVendor = /Apple Computer, Inc./i.test(navigator.vendor)

export const isSafari = isAppleVendor && navigator.userAgent.match(/Safari/i)

export const isMobileButNotInstalledOnHomeScreen = isMobileBrowser && !isInstalledOnHomeScreen
