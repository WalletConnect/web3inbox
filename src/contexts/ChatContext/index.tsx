import { ChatClient } from "@walletconnect/chat-client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ChatContext from "./context";

interface ChatContextProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
}) => {
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  const [registeredKey, setRegistered] = useState<string | null>(null);

  const { address } = useAccount();

  useEffect(() => {
    if (!(chatClient && address)) return;
    chatClient.register({ account: `eip155:1:${address}` }).then(setRegistered);
  }, [address, chatClient]);

  useEffect(() => {
    if (chatClient) return;
    const relayUrl = import.meta.env.VITE_RELAY_URL;
    const projectId = import.meta.env.VITE_PROJECT_ID;

    ChatClient.init({
      logger: "debug",
      relayUrl,
      projectId,
    }).then(setChatClient);
  }, [setChatClient, chatClient]);

  console.log({ registeredKey });

  return (
    <ChatContext.Provider value={{ chatClient, registeredKey }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
