import React, { useCallback, useContext, useEffect, useState } from 'react'
import SendIcon from '../../../assets/SendFilled.svg'
import W3iContext from '../../../contexts/W3iContext/context'
import Textarea from '../../general/Textarea'
import './MessageBox.scss'

interface MessageBoxProps {
  topic: string
  authorAccount: string
  onSuccessfulSend: () => void
}

const MessageBox: React.FC<MessageBoxProps> = ({ topic, authorAccount, onSuccessfulSend }) => {
  const [messageText, setMessageText] = useState('')
  const { chatClientProxy } = useContext(W3iContext)

  const onSend = useCallback(async () => {
    if (!chatClientProxy || !messageText) {
      return
    }
    await chatClientProxy.message({
      topic,
      payload: {
        authorAccount,
        message: messageText,
        timestamp: new Date().getTime()
      }
    })
    onSuccessfulSend()
    setMessageText('')
  }, [messageText, authorAccount, topic, onSuccessfulSend])

  useEffect(() => {
    const onKeydown = (keydownEvent: KeyboardEvent) => {
      if (keydownEvent.key !== 'Enter') {
        return
      }
      onSend()
    }

    document.addEventListener('keydown', onKeydown)

    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }, [onSend])

  return (
    <div className="MessageBox">
      <Textarea
        placeholder="Message..."
        value={messageText}
        onChange={({ target }) => setMessageText(target.value)}
      />
      <button onClick={onSend} className="MessageBox__send">
        <img src={SendIcon} alt="Send" />
      </button>
    </div>
  )
}

export default MessageBox
