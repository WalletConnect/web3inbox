import { ChatClientTypes } from "@walletconnect/chat-client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Input from "../../general/Input";
import Search from "../../../assets/Search.svg";
import ChatContext from "../../../contexts/ChatContext/context";
import { useAccount } from "wagmi";
import Thread from "../Thread";
import "./ThreadSelector.scss";

interface ThreadSelectorProps {}

const ThreadSelector: React.FC<ThreadSelectorProps> = (props) => {
  const { chatClient } = useContext(ChatContext);
  const { address } = useAccount();
  const [search, setSearch] = useState<string>("");
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([]);

  useEffect(() => {
    if (!chatClient) return;

    console.log({ threads });

    setThreads(chatClient.chatThreads.getAll());
  }, [chatClient]);

  useEffect(() => {
    if (!search && chatClient) setThreads(chatClient.chatThreads.getAll());
    setThreads((oldThreads) => {
      return oldThreads.filter((thread) => thread.peerAccount.includes(search));
    });
  }, [setThreads, search, chatClient]);

  const invite = useCallback(
    (inviteeAddress: string) => {
      if (!address || !chatClient) return;
      chatClient.invite({
        account: inviteeAddress,
        invite: {
          account: `eip155:1:${address}`,
          message: "Inviting",
        },
      });
    },
    [address]
  );

  return (
    <div className="ThreadSelector">
      <Input
        onChange={({ target }) => setSearch(target.value)}
        value={search}
        placeholder="Search"
        icon={Search}
      />
      <div className="Threads">
        {threads.map(({ peerAccount, topic }) => {
          return (
            <Thread topic={topic} threadPeer={peerAccount} key={peerAccount} />
          );
        })}
      </div>
      <div className="Action">
        {Object.keys(threads).length === 0 && (
          <button onClick={() => invite(search)}>New chat</button>
        )}
      </div>
    </div>
  );
};

export default ThreadSelector;
