import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { W3iChatClient } from '../../w3iProxy'

interface ChatContextState {
  chatClientProxy: W3iChatClient | null
  registeredKey: string | null
  refreshThreadsAndInvites: () => void
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  threads: ChatClientTypes.Thread[]
  invites: ChatClientTypes.Invite[]
  userPubkey?: string
}

const ChatContext = createContext<ChatContextState>({
  chatClientProxy: null,
  registeredKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshThreadsAndInvites: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserPubkey: () => {},
  threads: [],
  invites: [],
})

export default ChatContext
