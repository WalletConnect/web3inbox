import { createContext } from 'react'
import type { W3iChatClient } from '../../w3iProxy'

interface ChatContextState {
  chatClientProxy: W3iChatClient | null
  registeredKey: string | null
}

const context = createContext<ChatContextState>({
  chatClientProxy: null,
  registeredKey: null
})

export default context
