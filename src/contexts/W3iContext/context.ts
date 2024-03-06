import type { Dispatch, SetStateAction } from 'react'
// eslint-disable-next-line no-duplicate-imports
import { createContext } from 'react'

export interface UiEnabled {
  chat: boolean
  notify: boolean
  settings: boolean
  sidebar: boolean
}

interface W3iContextState {
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  userPubkey?: string
  notifyRegisteredKey: string | null
  watchSubscriptionsComplete: boolean
}

const W3iContext = createContext<W3iContextState>({
  notifyRegisteredKey: '',
  setUserPubkey: () => {},
  watchSubscriptionsComplete: false
})

export default W3iContext
