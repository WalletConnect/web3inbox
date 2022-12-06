import React from "react";
import "./Message.scss";

interface MessageProps {
  text: string;
  from: "peer" | "sender";
}

const Message: React.FC<MessageProps> = ({ text, from }) => {
  return (
    <div className={`Message Message__from-${from}`}>
      <div className="Message__bubble">{text}</div>
    </div>
  );
};

export default Message;
