import React, { useEffect, useReducer } from 'react'
import { useColorModeValue } from '../../utils/hooks'
import type { SettingsContextSimpleState, SettingsContextUpdate } from './context'
import SettingsContext from './context'
import { useWeb3ModalTheme } from '@web3modal/wagmi/react'

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
  const favoriteTheme =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    typeof localStorage === 'undefined' || !localStorage
      ? null
      : (localStorage.getItem('w3i-theme') as SettingsContextSimpleState['mode'] | null)

  const initialState: SettingsContextSimpleState = {
    mode: 'light',
    newContacts: 'require-invite',
    isDevModeEnabled: true
  }

  const { setThemeMode } = useWeb3ModalTheme()
  const [settingsState, updateSettings] = useReducer(settingsReducer, initialState)
  const themeColors = useColorModeValue(settingsState.mode)

  useEffect(() => {
    // setThemeMode(favoriteTheme === 'light' ? 'light' : 'dark')
  }, [setThemeMode, favoriteTheme])

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
