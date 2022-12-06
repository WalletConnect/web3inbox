import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatContext from "../../../contexts/ChatContext/context";
import Input from "../../general/Input";
import SendIcon from "../../../assets/SendFilled.svg";
import "./MessageBox.scss";

interface MessageBoxProps {
  topic: string;
  authorAccount: string;
  onSuccessfulSend: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  topic,
  authorAccount,
  onSuccessfulSend,
}) => {
  const [messageText, setMessageText] = useState("");
  const { chatClient } = useContext(ChatContext);
  const ref = useRef<HTMLInputElement>(null);

  console.log("MESSAGEBOX", topic);

  // Using a ref to avoid to regenerating this function every time
  // messageText state changes.
  const onSend = useCallback(async () => {
    if (!chatClient || !ref.current) return;
    console.log({ authorAccount, message: ref.current.value, topic });
    await chatClient.message({
      topic,
      payload: {
        authorAccount,
        message: ref.current.value,
        timestamp: new Date().getTime(),
      },
    });
    onSuccessfulSend();
    setMessageText("");
  }, [ref, authorAccount, topic, onSuccessfulSend]);

  useEffect(() => {
    const onKeydown = (keydownEvent: KeyboardEvent) => {
      if (keydownEvent.key !== "Enter") return;
      onSend().then(() => console.log("aaa"));
    };

    document.addEventListener("keydown", onKeydown);

    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [onSend]);

  return (
    <div className="MessageBox">
      <Input
        ref={ref}
        type="text"
        placeholder="Message..."
        value={messageText}
        onChange={({ target }) => setMessageText(target.value)}
      />
      <button onClick={onSend} className="MessageBox__send">
        <img src={SendIcon} alt="Send" />
      </button>
    </div>
  );
};

export default MessageBox;
