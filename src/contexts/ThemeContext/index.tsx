import React, { useReducer } from 'react'
import type { ThemeContextSimpleState, ThemeContextUpdate } from './context'
import ThemeContext from './context'

interface ThemeContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const themeReducer = (
  state: ThemeContextSimpleState,
  action: ThemeContextUpdate
): ThemeContextSimpleState => {
  console.log('Reducing')

  return { ...state, ...action }
}

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const initalState: ThemeContextSimpleState = {
    mode: 'system'
  }

  const [themeState, updateTheme] = useReducer(themeReducer, initalState)

  return (
    <ThemeContext.Provider
      value={{
        ...themeState,
        updateTheme: payload => {
          console.log({ payload })
          updateTheme(payload)
        }
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider
