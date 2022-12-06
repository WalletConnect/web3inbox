import React from "react";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import Avatar from "../../account/Avatar";
import "./Header.scss";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = (props) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });
  return (
    <div className="Header">
      <div className="Header__account">
        <Avatar src={ensAvatar} width="1.5em" height="1.5em" />
        <span>{ensName || address}</span>
      </div>
    </div>
  );
};

export default Header;
