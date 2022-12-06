import { ChatClientTypes } from "@walletconnect/chat-client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Input from "../../general/Input";
import Search from "../../../assets/Search.svg";
import ChatContext from "../../../contexts/ChatContext/context";
import { useAccount } from "wagmi";
import Thread from "../Thread";
import "./ThreadSelector.scss";
import Button from "../../general/Button";
import Invite from "../Invite";

interface ThreadSelectorProps {}

const ThreadSelector: React.FC<ThreadSelectorProps> = (props) => {
  const { chatClient } = useContext(ChatContext);
  const { address } = useAccount();
  const [search, setSearch] = useState<string>("");
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([]);
  const [invites, setInvites] = useState<ChatClientTypes.Invite[]>([]);

  const refreshThreads = useCallback(() => {
    if (!chatClient) return;

    setInvites(chatClient.chatInvites.getAll());
    setThreads(chatClient.chatThreads.getAll());
  }, [chatClient, setThreads, setInvites]);

  useEffect(() => {
    refreshThreads();
  }, [refreshThreads]);

  useEffect(() => {
    if (!search && chatClient) setThreads(chatClient.chatThreads.getAll());
    setThreads((oldThreads) => {
      return oldThreads.filter((thread) => thread.peerAccount.includes(search));
    });
  }, [setThreads, search, chatClient]);

  useEffect(() => {
    if (!chatClient) return;

    chatClient.on("chat_invite", refreshThreads);
    chatClient.on("chat_joined", refreshThreads);
  }, [chatClient]);

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
    [address, chatClient]
  );

  return (
    <div className="ThreadSelector">
      <Input
        onChange={({ target }) => setSearch(target.value)}
        value={search}
        placeholder="Search"
        icon={Search}
      />
      <div className="ThreadSelector__threads">
        {threads.map(({ peerAccount, topic }) => {
          return (
            <Thread topic={topic} threadPeer={peerAccount} key={peerAccount} />
          );
        })}
        {invites.length > 0 && <span>Invites:</span>}
        {invites.map(({ account, id, message }) => (
          <Invite
            address={account}
            key={account}
            message={message}
            id={id || 0}
            onSuccessfulAccept={refreshThreads}
          />
        ))}
        {threads.length === 0 && search && (
          <span className="ThreadSelector__contact">
            {search} is not in your contacts, send contact request
          </span>
        )}
      </div>
      <div className="ThreadSelector__action">
        {Object.keys(threads).length === 0 && search && (
          <Button
            type="primary"
            onClick={() => {
              invite(search);
            }}
          >
            Send Contact Request
          </Button>
        )}
      </div>
    </div>
  );
};

export default ThreadSelector;
