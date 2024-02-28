import type { Dispatch, SetStateAction } from 'react'
// eslint-disable-next-line no-duplicate-imports
import { createContext } from 'react'

import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { noop } from 'rxjs'

import type { W3iChatClient, W3iNotifyClient } from '@/w3iProxy'
import type { ChatClientTypes } from '@/w3iProxy/chatProviders/types'

export interface UiEnabled {
  chat: boolean
  notify: boolean
  settings: boolean
  sidebar: boolean
}

interface W3iContextState {
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  activeSubscriptions: NotifyClientTypes.NotifySubscription[]
  userPubkey?: string
  notifyRegisteredKey: string | null
  watchSubscriptionsComplete: boolean
}

const W3iContext = createContext<W3iContextState>({
  notifyRegisteredKey: '',
  setUserPubkey: noop,
  activeSubscriptions: [],
  watchSubscriptionsComplete: false
})

export default W3iContext
