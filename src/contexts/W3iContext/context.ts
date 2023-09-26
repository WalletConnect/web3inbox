import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { NotifyClientTypes } from '@walletconnect/notify-client'
import type { Dispatch, SetStateAction } from 'react'
// eslint-disable-next-line no-duplicate-imports
import { createContext } from 'react'
import { noop } from 'rxjs'
import type { W3iChatClient, W3iPushClient } from '../../w3iProxy'

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
  pushClientProxy: W3iPushClient | null
  pushRegisteredKey: string | null
  pushRegisterMessage: string | null
  pushProvider: string
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
  pushRegisteredKey: '',
  refreshThreadsAndInvites: noop,
  refreshNotifications: noop,
  setUserPubkey: noop,
  threads: [],
  uiEnabled: { chat: true, notify: true, settings: true, sidebar: true },
  activeSubscriptions: [],
  sentInvites: [],
  invites: [],
  pushClientProxy: null,
  pushRegisterMessage: null,
  pushProvider: '',
  authProvider: '',
  dappOrigin: '',
  dappIcon: '',
  dappNotificationDescription: '',
  dappName: '',
  chatClientProxy: null
})

export default W3iContext
