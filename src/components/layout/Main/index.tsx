import React from "react";
import { useLocation } from "react-router-dom";
import ThreadWindow from "../../messages/ThreadWindow";
import "./Main.scss";

interface MainProps {}

const Main: React.FC<MainProps> = (props) => {
  const { pathname } = useLocation();
  const paths = pathname.split("/").slice(1);
  const display = {
    messages: {
      chat: <ThreadWindow />,
    },
  };

  return <main className="Main">{display[paths[0]][paths[1]]}</main>;
};

export default Main;
