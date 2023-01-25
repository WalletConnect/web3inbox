import type { RefObject} from 'react';
import { useState } from 'react';
import { useEffect } from 'react'
import type { SettingsContextSimpleState } from '../contexts/SettingsContext/context';
import { profileModalService, shareModalService } from './store';

export const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return
        }
        handler(event)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    [ref, handler]
  )
}

export const useColorModeValue = (mode: SettingsContextSimpleState["mode"]) => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : "light"
  const specifiedMode = mode === "system" ? systemTheme : mode  
  const colors = {
    dark: {
      bg1: 'hsla(0, 0%, 8%, 1)',
      bg2: 'hsla(180, 4%, 16%, 1)',
      bg3: 'hsla(0, 0%, 0%, 0.1)',
      bgGradient1: 'linear-gradient(180deg, #1b1d1d 0%, #141414 29.96%)',
      activeLinkGradient: 'linear-gradient(92.29deg, #19324D 0%, rgba(25, 50, 77, 0.5) 100%)',
      fg1: 'hsla(180, 6%, 90%, 1)',
      fg2: 'hsla(0, 0%, 100%, 0.66)',
      fg3: 'hsla(180, 6%, 64%, 1)',
      fg4: 'hsla(180, 5%, 50%, 1)',
      fg5: 'hsla(0, 0%, 100%, 1)',
      border1: 'hsla(0, 0%, 0%, 0.5)',
      accent1: 'hsla(211, 90%, 50%, 1)',
      error1: 'hsla(5, 85%, 60%, 1)',
      icon1: 'hsla(180, 6%, 80%, 1)'
    },
    light: {
      bg1: 'hsla(0, 0%, 100%, 1)',
      bg2: 'hsla(0, 0%, 96%, 1)',
      bg3: 'hsla(0, 0%, 100%, 0.1)',
      bgGradient1: 'linear-gradient(180deg, #f7f7f7 0%, rgba(255, 255, 255, 0) 29.96%)',
      activeLinkGradient: ' linear-gradient(92.43deg, #CDE5FE 0%, #E8F2FC 101.3%)',
      fg1: 'hsla(0, 0%, 8%, 1)',
      fg2: 'hsla(180, 5%, 50%, 1)',
      fg3: 'hsla(180, 6%, 64%, 1)',
      fg4: 'hsla(180, 4%, 16%, 1)',
      fg5: 'hsla(0, 0%, 100%, 1)',
      border1: 'hsla(0, 0%, 0%, 0.1)',
      accent1: 'hsla(211, 100%, 60%, 1)',
      error1: 'hsla(5, 85%, 60%, 1)',
      icon1: 'hsla(180, 4%, 16%, 1)'
    }
  }

  const colorModeVariables = {
    '--bg-color-1': colors[specifiedMode].bg1,
    '--bg-color-2': colors[specifiedMode].bg2,
    '--bg-color-3': colors[specifiedMode].bg3,
    '--bg-gradient-1': colors[specifiedMode].bgGradient1,
    '--active-link-gradient': colors[specifiedMode].activeLinkGradient,
    '--fg-color-1': colors[specifiedMode].fg1,
    '--fg-color-2': colors[specifiedMode].fg2,
    '--fg-color-3': colors[specifiedMode].fg3,
    '--fg-color-4': colors[specifiedMode].fg4,
    '--fg-color-5': colors[specifiedMode].fg5,
    '--border-color-1': colors[specifiedMode].border1,
    '--accent-color-1': colors[specifiedMode].accent1,
    '--error-color-1': colors[specifiedMode].error1,
    '--icon-color-1': colors[specifiedMode].icon1,
  }
  
  return colorModeVariables;
}

export const useModals = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    const profileSubscription = profileModalService.modalState.subscribe(isOpen => {
      setIsProfileModalOpen(isOpen)
    })
    const shareSubscription = shareModalService.modalState.subscribe(isOpen => {
      setIsShareModalOpen(isOpen)
    })

    return () => {
      profileSubscription.unsubscribe()
      shareSubscription.unsubscribe()
    }
  }, [])

  return {
    isProfileModalOpen,
    isShareModalOpen
  }
}
