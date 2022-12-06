import React, { useContext } from "react";
import { useEnsAvatar } from "wagmi";
import Avatar from "../../account/Avatar";
import ChatContext from "../../../contexts/ChatContext/context";
import "./Invite.scss";

interface InviteProps {
  id: number;
  address: string;
  message: string;
  onSuccessfulAccept: () => void;
}

const Invite: React.FC<InviteProps> = ({
  address,
  onSuccessfulAccept,
  id,
  message,
}) => {
  const { chatClient } = useContext(ChatContext);
  const evmAddress = address.split(":")[2] as `0x${string}`;
  const { data: ensAvatar } = useEnsAvatar({
    address: evmAddress,
  });

  return (
    <div
      onClick={() => chatClient?.accept({ id }).then(onSuccessfulAccept)}
      className="Invite"
    >
      <div className="Invite__inviter">
        <Avatar src={ensAvatar} width="1.25em" height="1.25em" />
        <span>{address}</span>
      </div>
      <div className="Invite__message">{message}</div>
    </div>
  );
};

export default Invite;
