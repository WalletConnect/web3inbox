import { createContext } from 'react'

export interface SettingsContextUpdate {
  mode?: 'dark' | 'light' | 'system'
  newContacts?: 'accept-new' | 'reject-new' | 'require-invite'
}

export type SettingsContextSimpleState = Required<SettingsContextUpdate>

export type SettingsContextState = SettingsContextSimpleState & {
  updateSettings: (updatePayload: SettingsContextUpdate) => void
}

const SettingsContext = createContext<SettingsContextState>({
  mode: 'system',
  newContacts: 'require-invite',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateSettings: () => {}
})

export default SettingsContext
