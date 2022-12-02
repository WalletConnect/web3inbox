import type { ChatClient } from "@walletconnect/chat-client";
import { createContext } from "react";

interface ChatContextState {
  chatClient: ChatClient | null;
  registeredKey: string | null;
}

const context = createContext<ChatContextState>({
  chatClient: null,
  registeredKey: null,
});

export default context;
