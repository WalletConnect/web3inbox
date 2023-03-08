import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { PushClientTypes } from '@walletconnect/push-client'
import type { Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import type { W3iChatClient, W3iPushClient } from '../../w3iProxy'

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
  pushClientProxy: W3iPushClient | null
  registerMessage: string | null
}

const W3iContext = createContext<W3iContextState>({
  chatClientProxy: null,
  registeredKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshThreadsAndInvites: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserPubkey: () => {},
  threads: [],
  activeSubscriptions: [],
  sentInvites: [],
  invites: [],
  pushClientProxy: null,
  registerMessage: null
})

export default W3iContext
