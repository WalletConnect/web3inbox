import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import W3iContext from '../../../contexts/W3iContext/context'
import Textarea from '../../general/Textarea'
import './MessageBox.scss'
import SendIcon from '../../general/Icon/SendIcon'
import type { ChatClientTypes } from '@walletconnect/chat-client'

interface MessageBoxProps {
  topic: string
  authorAccount: string
}

const MessageBox: React.FC<MessageBoxProps> = ({ topic, authorAccount }) => {
  const [messageText, setMessageText] = useState('')
  const { chatClientProxy } = useContext(W3iContext)

  const isDisabled = useMemo(
    () =>
      (topic.includes('invite:')
        ? (topic.split(':')[1] as ChatClientTypes.SentInvite['status'])
        : 'approved') !== 'approved',
    [topic]
  )

  const onSend = useCallback(async () => {
    if (!chatClientProxy || !messageText) {
      return
    }
    await chatClientProxy.message({
      topic,
      authorAccount,
      message: messageText,
      timestamp: new Date().getTime()
    })
    setMessageText('')
  }, [messageText, authorAccount, topic])

  useEffect(() => {
    const onKeydown = (keydownEvent: KeyboardEvent) => {
      // Shift + Enter will result in new line and other keys are ignored
      if ((keydownEvent.shiftKey && keydownEvent.key === 'Enter') || keydownEvent.key !== 'Enter') {
        return
      }
      // Prevent new line when pressing Enter
      keydownEvent.preventDefault()

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
        disabled={isDisabled}
        onChange={({ target }) => setMessageText(target.value)}
      />
      <button
        onClick={onSend}
        title={messageText === '' ? 'Message cannot be empty' : 'Send message'}
        disabled={isDisabled || messageText === ''}
        className="MessageBox__send"
      >
        <SendIcon />
      </button>
    </div>
  )
}

export default MessageBox
