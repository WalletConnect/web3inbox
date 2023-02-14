import type { Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { W3iChatClient } from '../../w3iProxy'

interface W3iContextState {
  chatClientProxy: W3iChatClient | null
  registeredKey: string | null
  refreshThreadsAndInvites: () => void
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  threads: ChatClientTypes.Thread[]
  invites: ChatClientTypes.ReceivedInvite[]
  userPubkey?: string
}

const W3iContext = createContext<W3iContextState>({
  chatClientProxy: null,
  registeredKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshThreadsAndInvites: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserPubkey: () => {},
  threads: [],
  invites: []
})

export default W3iContext
