import { createContext } from 'react'
import type { W3iChatClient } from '../../w3iProxy'

interface ChatContextState {
  chatClient: W3iChatClient | null
  registeredKey: string | null
}

const context = createContext<ChatContextState>({
  chatClient: null,
  registeredKey: null
})

export default context
