import { createContext } from 'react'
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { W3iChatClient } from '../../w3iProxy'

interface ChatContextState {
  chatClientProxy: W3iChatClient | null
  registeredKey: string | null
  refreshThreadsAndInvites: () => void
  threads: ChatClientTypes.Thread[]
  invites: ChatClientTypes.Invite[]
  userPubkey?: string
}

const ChatContext = createContext<ChatContextState>({
  chatClientProxy: null,
  registeredKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshThreadsAndInvites: () => {},
  threads: [],
  invites: []
})

export default ChatContext
