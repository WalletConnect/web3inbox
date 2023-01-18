import { createContext } from 'react'

export interface ThemeContextUpdate {
  mode?: 'dark' | 'light' | 'system'
}

export type ThemeContextSimpleState = Required<ThemeContextUpdate>

export type ThemeContextState = ThemeContextSimpleState & {
  updateTheme: (updatePayload: ThemeContextUpdate) => void
}

const ThemeContext = createContext<ThemeContextState>({
  mode: 'system',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateTheme: () => {}
})

export default ThemeContext
