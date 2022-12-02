import React, { useContext, useEffect } from "react";
import ChatContext from "../../../contexts/ChatContext/context";

interface ThreadSelectorProps {}

const ThreadSelector: React.FC<ThreadSelectorProps> = (props) => {
  const { chatClient } = useContext(ChatContext);

  useEffect(() => {
    if (!chatClient) return;

    chatClient.getThreads();
  }, [chatClient]);

  return <div className="ThreadSelector"></div>;
};

export default ThreadSelector;
