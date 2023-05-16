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

  const inviteStatus = useMemo(() => {
    if (topic.includes('invite:')) {
      return topic.split(':')[1] as ChatClientTypes.SentInvite['status']
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
            <>
              Your chat invite was declined{' '}
              <button className="MessageBox__status--btn">
                Retry
                <svg
                  width="9"
                  height="12"
                  viewBox="0 0 12 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00833 2.03033C6.30122 1.73744 6.30122 1.26256 6.00833 0.96967C5.71543 0.676777 5.24056 0.676777 4.94767 0.96967L1.62444 4.29289C1.23392 4.68342 1.23392 5.31658 1.62444 5.70711L4.94767 9.03033C5.24056 9.32322 5.71543 9.32322 6.00833 9.03033C6.30122 8.73744 6.30122 8.26256 6.00833 7.96967L4.21543 6.17678C4.05794 6.01929 4.16948 5.75 4.39221 5.75H6.47802C8.68716 5.75 10.478 7.54086 10.478 9.75C10.478 11.9591 8.68716 13.75 6.47802 13.75C4.5238 13.75 2.89689 12.3486 2.54745 10.4959C2.47067 10.0889 2.14223 9.75 1.72802 9.75C1.3138 9.75 0.972649 10.0876 1.02846 10.4981C1.39342 13.1818 3.69419 15.25 6.47802 15.25C9.51558 15.25 11.978 12.7876 11.978 9.75C11.978 6.71243 9.51558 4.25 6.47802 4.25H4.39221C4.16948 4.25 4.05794 3.98071 4.21543 3.82322L6.00833 2.03033Z"
                    fill="currentcolor"
                  />
                </svg>
              </button>
            </>
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
