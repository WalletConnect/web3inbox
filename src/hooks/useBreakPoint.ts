import { useEffect, useState } from 'react'

import { screenBreakPoints as breakpoints } from '@/utils/ui'

export default function useBreakPoint() {
  const initialWidth = typeof window === 'undefined' ? breakpoints.lg : window.innerWidth
  const [windowWidth, setWindowWidth] = useState(initialWidth)

  useEffect(() => {
    function handleResize() {
      if (typeof window === 'undefined') return
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = windowWidth < breakpoints.sm
  const isTablet = windowWidth >= breakpoints.sm && windowWidth < breakpoints.md
  const isDesktop = windowWidth >= breakpoints.md
  const isDesktopLg = windowWidth >= breakpoints.lg

  return {
    width: windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isDesktopLg
  }
}
