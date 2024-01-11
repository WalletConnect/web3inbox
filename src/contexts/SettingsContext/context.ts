import { createContext } from 'react'

import { noop } from '@/utils/general'

export interface SettingsContextUpdate {
  mode?: 'dark' | 'light' | 'system'
  newContacts?: 'accept-new' | 'reject-new' | 'require-invite'
  isDevModeEnabled?: boolean
  filterAppDomain?: string
}

export type SettingsContextSimpleState = Required<SettingsContextUpdate>

export type SettingsContextState = SettingsContextSimpleState & {
  updateSettings: (updatePayload: SettingsContextUpdate) => void
}

const SettingsContext = createContext<SettingsContextState>({
  mode: 'light',
  newContacts: 'require-invite',
  isDevModeEnabled: true,
  updateSettings: noop,
  filterAppDomain: ''
})

export default SettingsContext
