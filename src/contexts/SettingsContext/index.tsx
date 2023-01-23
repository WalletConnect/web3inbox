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
  const initialState: SettingsContextSimpleState = {
    mode: 'system',
    newContacts: 'require-invite'
  }
  const [settingsState, updateSettings] = useReducer(settingsReducer, initialState)
  const themeColors = useColorModeValue(settingsState.mode)

  useEffect(() => {
    Object.entries(themeColors).forEach(([colorVariable, colorValue]) => {
      document.documentElement.style.setProperty(colorVariable, colorValue)
    })
  }, [themeColors])

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
