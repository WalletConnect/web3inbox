import React, { useEffect, useReducer } from 'react'
import { useColorModeValue } from '../../utils/hooks'
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

const SettingsContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const localSettings = localStorage.getItem('w3i-settings')

  const initialState: SettingsContextSimpleState = localSettings? JSON.parse(localSettings) : {
    mode: 'light',
    newContacts: 'require-invite',
    isDevModeEnabled: true
  }

  const [settingsState, updateSettings] = useReducer(settingsReducer, initialState)
  const themeColors = useColorModeValue(settingsState.mode)

  useEffect(() => {
    Object.entries(themeColors).forEach(([colorVariable, colorValue]) => {
      document.documentElement.style.setProperty(colorVariable, colorValue)
    })
  }, [themeColors])

  useEffect(() => {
    localStorage?.setItem("w3i-settings", JSON.stringify(settingsState))
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
