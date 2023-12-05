import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import SendIcon from '@/components/general/Icon/SendIcon'
import Textarea from '@/components/general/Textarea'
import W3iContext from '@/contexts/W3iContext/context'

import './MessageBox.scss'

interface MessageBoxProps {
  topic: string
  authorAccount: string
}

const MessageBox: React.FC<MessageBoxProps> = ({ topic, authorAccount }) => {
  const [messageText, setMessageText] = useState('')
  const { chatClientProxy } = useContext(W3iContext)

  const inviteStatus = useMemo(() => {
    if (topic.includes('invite:')) {
      return topic.split(':')[1]
    }

    return 'approved'
  }, [topic])

  const isDisabled = useMemo(() => inviteStatus !== 'approved', [inviteStatus])

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
      {isDisabled ? (
        <p className="MessageBox__status">
          {inviteStatus === 'pending' ? (
            <>Waiting to accept your invite…</>
          ) : (
            <>Your chat invite was declined</>
          )}
        </p>
      ) : (
        <>
          <Textarea
            placeholder="Message..."
            value={messageText}
            onChange={({ target }) => setMessageText(target.value)}
          />
          <button
            onClick={onSend}
            title={messageText === '' ? 'Message cannot be empty' : 'Send message'}
            disabled={messageText === ''}
            className="MessageBox__send"
          >
            <SendIcon />
          </button>
        </>
      )}
    </div>
  )
}

export default MessageBox
