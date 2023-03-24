import React, { useCallback, useContext } from 'react'
import W3iContext from '../../../../contexts/W3iContext/context'
import Dropdown from '../../../general/Dropdown/Dropdown'
import CrossIcon from '../../../general/Icon/CrossIcon'
import './ThreadDropdown.scss'

interface ThreadDropdownProps {
  threadId: string
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  w: string
  h: string
  closeDropdown: () => void
}

const ThreadDropdown: React.FC<ThreadDropdownProps> = ({
  w,
  h,
  closeDropdown,
  dropdownPlacement,
  threadId
}) => {
  const { chatClientProxy, refreshThreadsAndInvites } = useContext(W3iContext)

  const onClickLeave = useCallback(
    (thread: string) => {
      if (chatClientProxy) {
        chatClientProxy.leave({ topic: thread }).then(refreshThreadsAndInvites)
        closeDropdown()
      }
    },
    [chatClientProxy]
  )

  return (
    <Dropdown btnShape="square" h={h} dropdownPlacement={dropdownPlacement} w={w}>
      <div className="ThreadDropdown">
        <button
          className="ThreadDropdown__button ThreadDropdown__button--leave"
          onClick={() => onClickLeave(threadId)}
        >
          <CrossIcon fillColor="hsla(5, 85%, 60%, 1)" />
          Leave Thread
        </button>
      </div>
    </Dropdown>
  )
}

export default ThreadDropdown
