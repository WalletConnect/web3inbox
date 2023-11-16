import React, { useEffect, useReducer, useState } from 'react'
import { useColorModeValue } from '../../utils/hooks'
import type { SettingsContextSimpleState, SettingsContextUpdate } from './context'
import SettingsContext from './context'

const LOCAL_SETTINGS_KEY = 'w3i-settings'

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
  const localSettings = localStorage.getItem(LOCAL_SETTINGS_KEY)


  const initialState: SettingsContextSimpleState = localSettings
    ? JSON.parse(localSettings)
    : {
        mode: 'light',
        newContacts: 'require-invite',
        isDevModeEnabled: false
      }

  const [settingsState, updateSettings] = useReducer(settingsReducer, initialState)

  const [filterAppDomain, setFilterAppDomain] = useState("");

  const themeColors = useColorModeValue(settingsState.mode)

  useEffect(() => {
    Object.entries(themeColors).forEach(([colorVariable, colorValue]) => {
      document.documentElement.style.setProperty(colorVariable, colorValue)
    })
  }, [themeColors])

  useEffect(() => {
    localStorage?.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settingsState))
  }, [settingsState])

  return (
    <SettingsContext.Provider
      value={{
        ...settingsState,
        updateSettings,
	filterAppDomain,
	setFilterAppDomain
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContextProvider
