import React, { useReducer } from 'react'
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
  const initalState: SettingsContextSimpleState = {
    mode: 'system',
    newContacts: 'require-invite'
  }

  const [settingsState, updateSettings] = useReducer(settingsReducer, initalState)

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
