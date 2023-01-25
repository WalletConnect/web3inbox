import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import W3iContext from '../../../contexts/W3iContext/context'
import Input from '../../general/Input'
import SendIcon from '../../../assets/SendFilled.svg'
import './MessageBox.scss'

interface MessageBoxProps {
  topic: string
  authorAccount: string
  onSuccessfulSend: () => void
}

const MessageBox: React.FC<MessageBoxProps> = ({ topic, authorAccount, onSuccessfulSend }) => {
  const [messageText, setMessageText] = useState('')
  const { chatClientProxy } = useContext(W3iContext)
  const ref = useRef<HTMLInputElement>(null)

  /*
   * Using a ref to avoid to regenerating this function every time
   * messageText state changes.
   */
  const onSend = useCallback(async () => {
    if (!chatClientProxy || !ref.current) {
      return
    }
    await chatClientProxy.message({
      topic,
      payload: {
        authorAccount,
        message: ref.current.value,
        timestamp: new Date().getTime()
      }
    })
    onSuccessfulSend()
    setMessageText('')
  }, [ref, authorAccount, topic, onSuccessfulSend])

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
  )
}

export default MessageBox
