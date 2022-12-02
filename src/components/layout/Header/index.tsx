import React from "react";
import { useAccount, useEnsName } from "wagmi";
import "./Header.scss";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = (props) => {
  const { address } = useAccount();
  const { data } = useEnsName({ address });
  return <div className="Header">{data || address}</div>;
};

export default Header;
