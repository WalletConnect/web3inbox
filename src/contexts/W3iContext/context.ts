import type { Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { W3iChatClient, W3iPushClient } from '../../w3iProxy'

interface W3iContextState {
  chatClientProxy: W3iChatClient | null
  registeredKey: string | null
  refreshThreadsAndInvites: () => void
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  sentInvites: ChatClientTypes.SentInvite[]
  threads: ChatClientTypes.Thread[]
  invites: ChatClientTypes.ReceivedInvite[]
  userPubkey?: string
  pushClientProxy: W3iPushClient | null
}

const W3iContext = createContext<W3iContextState>({
  chatClientProxy: null,
  registeredKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshThreadsAndInvites: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserPubkey: () => {},
  threads: [],
  sentInvites: [],
  invites: [],
  pushClientProxy: null
})

export default W3iContext
