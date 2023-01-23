import React, { useEffect, useReducer } from 'react'
import type { SettingsContextSimpleState, SettingsContextUpdate } from './context'
import SettingsContext from './context'

interface ThemeContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const settingsReducer = (
  state: SettingsContextSimpleState,
  action: SettingsContextUpdate
): SettingsContextSimpleState => {
  return { ...state, ...action }
}

const darkModeColors = {
  '--bg-color-1': 'hsla(0, 0%, 8%, 1)',
  '--bg-color-2': 'hsla(180, 4%, 16%, 1)',
  '--bg-color-3': 'hsla(0, 0%, 100%, 0.1)',
  '--bg-gradient-1':
    'linear-gradient(180deg, hsla(180, 4%, 12%, 1) 0%, hsla(0, 0%, 8%, 0.1) 29.96%)',
  '--fg-color-1': 'hsla(180, 6%, 90%, 1)',
  '--fg-color-2': 'hsla(0, 0%, 100%, 0.66)',
  '--fg-color-3': 'hsla(180, 6%, 64%, 1)',
  '--fg-color-4': 'hsla(180, 5%, 50%, 1)',
  '--border-color-1': 'hsla(0, 0%, 0%, 0.5)',
  '--accent-color-1': 'hsla(211, 90%, 50%, 1)',
  '--error-color-1': 'hsla(5, 85%, 60%, 1)'
}

const lightModeColors = {
  '--bg-color-1': 'hsla(0, 0%, 100%, 1)',
  '--bg-color-2': 'hsla(0, 0%, 96%, 1)',
  '--bg-color-3': 'hsla(0, 0%, 100%, 0.1)',
  '--bg-gradient-1': 'linear-gradient(180deg, hsla(0, 0%, 96%, 1)0%, hsla(0, 0%, 100%, 1) 29.96%)',
  '--fg-color-1': 'hsla(0, 0%, 8%, 1)',
  '--fg-color-2': 'hsla(180, 5%, 50%, 1)',
  '--fg-color-3': 'hsla(180, 6%, 64%, 1)',
  '--fg-color-4': 'hsla(180, 4%, 16%, 1)',
  '--border-color-1': 'hsla(0, 0%, 0%, 0.1)',
  '--accent-color-1': 'hsla(211, 100%, 60%, 1)',
  '--error-color-1': 'hsla(5, 85%, 60%, 1)'
}

const SettingsContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const initialState: SettingsContextSimpleState = {
    mode: 'system',
    newContacts: 'require-invite'
  }

  const [settingsState, updateSettings] = useReducer(settingsReducer, initialState)
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (settingsState.mode === 'dark' || prefersDark) {
      Object.entries(darkModeColors).forEach(([colorVariable, colorValue]) => {
        document.documentElement.style.setProperty(colorVariable, colorValue)
      })
    }
    if (settingsState.mode === 'light' || !prefersDark) {
      Object.entries(lightModeColors).forEach(([colorVariable, colorValue]) => {
        document.documentElement.style.setProperty(colorVariable, colorValue)
      })
    }
  }, [settingsState])

  return (
    <SettingsContext.Provider
      value={{
        ...settingsState,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContextProvider
