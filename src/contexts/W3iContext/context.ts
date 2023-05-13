import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { PushClientTypes } from '@walletconnect/push-client'
import type { Dispatch, SetStateAction } from 'react'
// eslint-disable-next-line no-duplicate-imports
import { createContext } from 'react'
import type { W3iChatClient, W3iPushClient } from '../../w3iProxy'

export interface UiEnabled {
  chat: boolean
  push: boolean
  settings: boolean
  sidebar: boolean
}

interface W3iContextState {
  chatClientProxy: W3iChatClient | null
  registeredKey: string | null
  refreshThreadsAndInvites: () => void
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  activeSubscriptions: PushClientTypes.PushSubscription[]
  sentInvites: ChatClientTypes.SentInvite[]
  threads: ChatClientTypes.Thread[]
  invites: ChatClientTypes.ReceivedInvite[]
  userPubkey?: string
  disconnect: () => void
  pushClientProxy: W3iPushClient | null
  registerMessage: string | null
  chatProvider: string
  pushProvider: string
  uiEnabled: UiEnabled
}

const W3iContext = createContext<W3iContextState>({
  chatClientProxy: null,
  registeredKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshThreadsAndInvites: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserPubkey: () => {},
  threads: [],
  uiEnabled: { chat: true, push: true, settings: true, sidebar: true },
  activeSubscriptions: [],
  sentInvites: [],
  invites: [],
  pushClientProxy: null,
  registerMessage: null,
  chatProvider: '',
  pushProvider: ''
})

export default W3iContext
