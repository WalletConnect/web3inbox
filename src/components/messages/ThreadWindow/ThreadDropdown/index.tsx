import React, { useCallback, useContext, useEffect, useState } from 'react'
import W3iContext from '../../../../contexts/W3iContext/context'
import Dropdown from '../../../general/Dropdown/Dropdown'
import CrossIcon from '../../../general/Icon/CrossIcon'
import NotificationMuteIcon from '../../../general/Icon/NotificationMuteIcon'
import './ThreadDropdown.scss'

interface ThreadDropdownProps {
  threadId: string
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  w: string
  h: string
  closeDropdown?: () => void
}

const ThreadDropdown: React.FC<ThreadDropdownProps> = ({ w, h, dropdownPlacement, threadId }) => {
  const { chatClientProxy, refreshThreadsAndInvites, threads } = useContext(W3iContext)
  const [isMuted, setIsMuted] = useState(false)

  const onClickLeave = useCallback(
    (thread: string) => {
      if (chatClientProxy) {
        chatClientProxy.leave({ topic: thread }).then(refreshThreadsAndInvites)
      }
    },
    [chatClientProxy]
  )

  const handleContactMuting = useCallback(
    async (topic: string) => {
      if (!chatClientProxy) {
        throw new Error('Chat client is not initialized')
      }

      if (isMuted) {
        await chatClientProxy.unmuteContact({ topic })
        setIsMuted(false)
      } else {
        await chatClientProxy.muteContact({ topic })
        setIsMuted(true)
      }
    },
    [chatClientProxy, isMuted]
  )

  useEffect(() => {
    if (chatClientProxy) {
      chatClientProxy.getMutedContacts().then(mutedContacts => {
        const foundMutedContact = mutedContacts.find(
          contactThreadcId => contactThreadcId === threadId
        )
        if (foundMutedContact) {
          setIsMuted(true)
        }
      })
    }
  }, [threads, chatClientProxy])

  return (
    <Dropdown btnShape="square" h={h} dropdownPlacement={dropdownPlacement} w={w}>
      <div className="ThreadDropdown">
        <button
          className="ThreadDropdown__button"
          onClick={async () => handleContactMuting(threadId)}
        >
          <NotificationMuteIcon fillColor="white" />
          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>
        <button
          className="ThreadDropdown__button ThreadDropdown__button--leave"
          onClick={() => onClickLeave(threadId)}
        >
          <CrossIcon fillColor="hsla(5, 85%, 60%, 1)" />
          <span>Leave Thread</span>
        </button>
      </div>
    </Dropdown>
  )
}

export default ThreadDropdown
