import type { RefObject } from 'react'
// eslint-disable-next-line no-duplicate-imports
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'

import type { SettingsContextSimpleState } from '@/contexts/SettingsContext/context'

// eslint-disable-next-line no-duplicate-imports
import {
  appSearchService,
  chatSearchService,
  contactsModalService,
  notificationPwaModalService,
  notifySearchService,
  preferencesModalService,
  profileModalService,
  shareModalService,
  signatureModalService,
  unsubscribeModalService
} from './store'
import { isMobile } from './ui'

const displays = {
  '--targetselector-display': 'unset',
  '--main-display': 'unset',
  '--header-display': 'unset'
}

export const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const typeEvent = isMobile() ? `touchstart` : `mousedown`
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener(typeEvent, listener)

    return () => {
      document.removeEventListener(typeEvent, listener)
    }
  }, [ref, handler])
}

export const useColorModeValue = (mode: SettingsContextSimpleState['mode']) => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const specifiedMode = mode === 'system' ? systemTheme : mode
  const colors = {
    dark: {
      bg1: 'hsla(0, 0%, 8%, 1)',
      bg2: 'hsla(180, 4%, 16%, 1)',
      bg3: 'hsla(0, 0%, 0%, 0.1)',
      bg4: 'hsla(0, 0%, 100%, 0.1)',
      senderBubbleBg: '#272a2a',
      bgGradient1: 'linear-gradient(180deg, #1b1d1d 0%, #141414 29.96%)',
      bgGradient2: 'linear-gradient(92.29deg, #19324D 0%, rgba(25, 50, 77, 0.5) 100%)',
      activeLinkGradient: 'linear-gradient(92.29deg, #19324D 0%, rgba(25, 50, 77, 0.5) 100%)',
      senderBoxShadow: 'inset 1px 1px 4px #585f5f, inset -1px -1px 4px #141414',
      fg1: 'hsla(180, 6%, 90%, 1)',
      fg2: 'hsla(0, 0%, 100%, 0.66)',
      fg3: 'hsla(180, 6%, 64%, 1)',
      fg4: 'hsla(180, 5%, 50%, 1)',
      fg5: 'hsla(0, 0%, 100%, 1)',
      border1: 'hsla(0, 0%, 0%, 0.5)',
      border2: 'hsla(0, 0%, 100%, 0.1)',
      accent1: 'hsla(211, 90%, 50%, 1)',
      accent2: 'hsla(211, 90%, 50%, 0.08)',
      error1: 'hsla(5, 85%, 60%, 1)',
      icon1: 'hsla(180, 6%, 80%, 1)',
      qr1: '#e4e7e7',
      brightness: '0.66',
      shimmerFg: 'rgba(255, 255, 255, 0.05)',
      shimmerBg: 'rgba(0, 0, 0, 0.7)',
      modalOverlay: 'rgba(0, 0, 0, 0.6)',
      lightOverlay002: 'rgba(6, 43, 43, 0.02)',
      lightOverlay010: 'rgba(6, 43, 43, 0.1)',
      lightOverlay015: 'rgba(6, 43, 43, 0.15)',
      lightInverse: 'hsl(0, 0%, 100%)'
    },
    light: {
      bg1: 'hsla(0, 0%, 100%, 1)',
      bg2: 'hsla(0, 0%, 96%, 1)',
      bg3: 'hsla(0, 0%, 100%, 0.1)',
      bg4: 'hsla(0, 0%, 0%, 0.1)',
      senderBubbleBg: '#E1E9E9',
      senderBoxShadow: 'inset 1px 1px 4px #FFFFFF, inset -1px -1px 4px #9EA9A9',
      bgGradient1: 'linear-gradient(180deg, #f7f7f7 0%, rgba(255, 255, 255, 0) 29.96%)',
      bgGradient2: 'linear-gradient(91.31deg, #E8F2FC 0%, rgba(232, 242, 252, 0) 100%)',
      activeLinkGradient: ' linear-gradient(92.43deg, #CDE5FE 0%, #E8F2FC 101.3%)',
      fg1: 'hsla(0, 0%, 8%, 1)',
      fg2: 'hsla(180, 5%, 50%, 1)',
      fg3: 'hsla(180, 6%, 64%, 1)',
      fg4: 'hsla(180, 4%, 16%, 1)',
      fg5: 'hsla(0, 0%, 100%, 1)',
      border1: 'hsla(0, 0%, 0%, 0.5)',
      border2: 'hsla(0, 0%, 0%, 0.1)',
      accent1: 'hsla(211, 100%, 60%, 1)',
      accent2: 'hsla(211, 100%, 60%, 0.08)',
      error1: '#ED4747',
      icon1: 'hsla(180, 4%, 16%, 1)',
      qr1: '#141414',
      brightness: '1.33',
      shimmerFg: 'rgba(0, 0, 0, 0.1)',
      shimmerBg: 'rgba(255, 255, 255, 0.7)',
      modalOverlay: 'rgba(139, 151, 151, 0.3)',
      lightOverlay002: 'rgba(6, 43, 43, 0.02)',
      lightOverlay010: 'rgba(6, 43, 43, 0.1)',
      lightOverlay015: 'rgba(6, 43, 43, 0.15)',
      lightInverse: 'hsl(0, 0%, 100%)'
    }
  }

  const colorModeVariables = {
    '--bg-color-1': colors[specifiedMode].bg1,
    '--bg-color-2': colors[specifiedMode].bg2,
    '--bg-color-3': colors[specifiedMode].bg3,
    '--bg-color-4': colors[specifiedMode].bg4,
    '--bg-gradient-1': colors[specifiedMode].bgGradient1,
    '--bg-gradient-2': colors[specifiedMode].bgGradient2,
    '--active-link-gradient': colors[specifiedMode].activeLinkGradient,
    '--sender-bubble-bg': colors[specifiedMode].senderBubbleBg,
    '--sender-box-shadow': colors[specifiedMode].senderBoxShadow,
    '--fg-color-1': colors[specifiedMode].fg1,
    '--fg-color-2': colors[specifiedMode].fg2,
    '--fg-color-3': colors[specifiedMode].fg3,
    '--fg-color-4': colors[specifiedMode].fg4,
    '--fg-color-5': colors[specifiedMode].fg5,
    '--border-color-1': colors[specifiedMode].border1,
    '--border-color-2': colors[specifiedMode].border2,
    '--accent-color-1': colors[specifiedMode].accent1,
    '--accent-color-2': colors[specifiedMode].accent2,
    '--error-color-1': colors[specifiedMode].error1,
    '--icon-color-1': colors[specifiedMode].icon1,
    '--qr-color-1': colors[specifiedMode].qr1,
    '--brightness-multiplier': colors[specifiedMode].brightness,
    '--shimmer-fg': colors[specifiedMode].shimmerFg,
    '--shimmer-bg': colors[specifiedMode].shimmerBg,
    '--modal-overlay': colors[specifiedMode].modalOverlay,
    '--light-overlay-002': colors[specifiedMode].lightOverlay002,
    '--light-overlay-010': colors[specifiedMode].lightOverlay010,
    '--light-overlay-015': colors[specifiedMode].lightOverlay015,
    '--light-inverse': colors[specifiedMode].lightInverse
  }

  return colorModeVariables
}

export const useSearch = () => {
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false)
  const [isNotifySearchOpen, setIsNotifySearchOpen] = useState(false)
  const [isAppSearchOpen, setIsAppSearchOpen] = useState(false)
  const [appSearchTerm, setAppSearchTerm] = useState<string>()
  useEffect(() => {
    const chatSearchSubscription = chatSearchService.searchState.subscribe(isOpen => {
      setIsChatSearchOpen(isOpen)
    })
    const notifySearchSubscription = notifySearchService.searchState.subscribe(isOpen => {
      setIsNotifySearchOpen(isOpen)
    })
    const appSearchSubscription = appSearchService.searchState.subscribe(state => {
      setIsAppSearchOpen(state.isOpen)
      setAppSearchTerm(state.searchTerm)
    })

    return () => {
      chatSearchSubscription.unsubscribe()
      notifySearchSubscription.unsubscribe()
      appSearchSubscription.unsubscribe()
    }
  }, [])

  return { isChatSearchOpen, isNotifySearchOpen, isAppSearchOpen, appSearchTerm }
}

export const useModals = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  // Const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false)
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false)
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [isNotificationPwaModalOpen, setIsNotificationPwaModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [preferencesModalAppId, setPreferencesModalAppId] = useState<string>()
  /*
   * Const [subscribeModalMetadata, setSubscribeModalMetadata] =
   *   useState<NotifyClientTypes.NotifyRequestEventArgs>()
   */
  const [unsubscribeModalAppId, setUnsubscribeModalAppId] = useState<string>()

  useEffect(() => {
    const profileSubscription = profileModalService.modalState.subscribe(isOpen => {
      setIsProfileModalOpen(isOpen)
    })
    /*
     * Const subscribeSubscription = subscribeModalService.modalState.subscribe(state => {
     *   setSubscribeModalMetadata(state.metadata)
     *   setIsSubscribeModalOpen(state.isOpen)
     * })
     */
    const signatureSubscription = signatureModalService.modalState.subscribe(next => {
      setIsSignatureModalOpen(next.isOpen)
    })
    const isSigningSubscription = signatureModalService.modalState.subscribe(next => {
      setIsSigning(next.signing)
    })
    const contactsSubscription = contactsModalService.modalState.subscribe(isOpen => {
      setIsContactModalOpen(isOpen)
    })
    const shareSubscription = shareModalService.modalState.subscribe(isOpen => {
      setIsShareModalOpen(isOpen)
    })
    const notificationPwaModalSubscription = notificationPwaModalService.modalState.subscribe(
      isOpen => {
        setIsNotificationPwaModalOpen(isOpen)
      }
    )
    const preferencesSubscription = preferencesModalService.modalState.subscribe(state => {
      setPreferencesModalAppId(state.preferencesModalAppId)
      setIsPreferencesModalOpen(state.isOpen)
    })
    const unsubscribeSubscription = unsubscribeModalService.modalState.subscribe(state => {
      setUnsubscribeModalAppId(state.unsubscribeModalAppId)
      setIsUnsubscribeModalOpen(state.isOpen)
    })

    return () => {
      profileSubscription.unsubscribe()
      shareSubscription.unsubscribe()
      contactsSubscription.unsubscribe()
      signatureSubscription.unsubscribe()
      isSigningSubscription.unsubscribe()
      preferencesSubscription.unsubscribe()
      unsubscribeSubscription.unsubscribe()
      notificationPwaModalSubscription.unsubscribe()
    }
  }, [])

  return {
    isProfileModalOpen,
    isShareModalOpen,
    isSignatureModalOpen,
    isSigning,
    isContactModalOpen,
    isPreferencesModalOpen,
    isUnsubscribeModalOpen,
    preferencesModalAppId,
    unsubscribeModalAppId,
    isNotificationPwaModalOpen
  }
}

export const useIsMobile = () => {
  const [isMobileLayout, setIsMobileLayout] = useState(isMobile())

  useEffect(() => {
    const listener = () => {
      setIsMobileLayout(isMobile())
    }
    window.addEventListener('resize', listener)

    return () => window.removeEventListener('resize', listener)
  }, [setIsMobileLayout])

  return isMobileLayout
}

export const useMobileResponsiveGrid = () => {
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)

  const isMobileLayout = useIsMobile()

  useEffect(() => {
    if (!isMobileLayout) {
      Object.entries(displays).forEach(([cssKey, originalValue]) => {
        ref.current?.style.setProperty(cssKey, originalValue)
      })

      return
    }

    if (!ref.current) {
      return
    }

    Object.entries(displays).forEach(([cssKey]) => {
      ref.current?.style.setProperty(cssKey, 'none')
    })

    const navigationDepth = pathname.split('/').length

    // If the pathName matches .*/.*
    if (navigationDepth === 2) {
      ref.current.style.setProperty('--grid-template', '"target-selector"')
      ref.current.style.setProperty('--targetselector-display', 'unset')
      // If the pathName matches .*/.*/.*
    } else if (navigationDepth > 2) {
      ref.current.style.setProperty('--grid-template', '"main"')
      ref.current.style.setProperty('--main-display', 'unset')
    }
  }, [pathname, isMobileLayout])

  return ref
}

export const useFormattedTime = (timestamp?: number) => {
  const formattedTime = useMemo(() => {
    if (!timestamp) {
      return null
    }

    const today = new Date()
    const messageDate = new Date(timestamp)
    const diffInMilliseconds: number = today.getTime() - messageDate.getTime()

    const millisecondsPerMinute = 60 * 1000
    const millisecondsPerHour = 60 * millisecondsPerMinute
    const millisecondsPerDay = 24 * millisecondsPerHour
    const millisecondsPerWeek = 7 * millisecondsPerDay
    const millisecondsPerMonth = 30 * millisecondsPerDay
    const millisecondsPerYear = 365 * millisecondsPerDay

    if (diffInMilliseconds < millisecondsPerHour) {
      const minutes = Math.floor(diffInMilliseconds / millisecondsPerMinute)

      if (minutes === 0) {
        return `now`
      }

      return `${minutes}m ago`
    } else if (diffInMilliseconds < millisecondsPerDay) {
      const hours = Math.floor(diffInMilliseconds / millisecondsPerHour)

      return `${hours}h ago`
    } else if (diffInMilliseconds < millisecondsPerWeek) {
      const days = Math.floor(diffInMilliseconds / millisecondsPerDay)

      return `${days}d ago`
    } else if (diffInMilliseconds < millisecondsPerMonth) {
      const weeks = Math.floor(diffInMilliseconds / millisecondsPerWeek)

      return `${weeks}w ago`
    } else if (diffInMilliseconds < millisecondsPerYear) {
      const months = Math.floor(diffInMilliseconds / millisecondsPerMonth)

      return `${months}mo ago`
    }

    const years = Math.floor(diffInMilliseconds / millisecondsPerYear)

    return `${years}y`
  }, [timestamp])

  return formattedTime
}

// eslint-disable-next-line func-style
export function useResizeObserver<T extends HTMLElement>(
  callback: (target: T, entry: ResizeObserverEntry) => void
) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver(entries => {
      callback(element, entries[0])
    })

    observer.observe(element)

    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect()
    }
  }, [callback, ref])

  return ref
}
