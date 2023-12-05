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
  refreshThreadsAndInvites: () => void
  refreshNotifications: () => void
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  activeSubscriptions: NotifyClientTypes.NotifySubscription[]
  sentInvites: ChatClientTypes.SentInvite[]
  threads: ChatClientTypes.Thread[]
  invites: ChatClientTypes.ReceivedInvite[]
  userPubkey?: string
  notifyClientProxy: W3iNotifyClient | null
  notifyRegisteredKey: string | null
  notifyRegisterMessage: string | null
  notifyProvider: string
  authProvider: string
  uiEnabled: UiEnabled
  dappOrigin: string
  dappName: string
  dappIcon: string
  dappNotificationDescription: string
  // This is only kept to allow old components to build
  chatClientProxy: W3iChatClient | null
}

const W3iContext = createContext<W3iContextState>({
  notifyRegisteredKey: '',
  refreshThreadsAndInvites: noop,
  refreshNotifications: noop,
  setUserPubkey: noop,
  threads: [],
  uiEnabled: { chat: true, notify: true, settings: true, sidebar: true },
  activeSubscriptions: [],
  sentInvites: [],
  invites: [],
  notifyClientProxy: null,
  notifyRegisterMessage: null,
  notifyProvider: '',
  authProvider: '',
  dappOrigin: '',
  dappIcon: '',
  dappNotificationDescription: '',
  dappName: '',
  chatClientProxy: null
})

export default W3iContext
