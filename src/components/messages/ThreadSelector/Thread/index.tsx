/*
 * Code for the Swipe Thread component
 *
 * import React, { useContext, useEffect, useState } from 'react'
 * import W3iContext from '../../../../contexts/W3iContext/context'
 * import NavLink from '../../../general/NavLink'
 * import PeerAndMessage from '../../PeerAndMessage'
 * import './Thread.scss'
 * // eslint-disable-next-line @typescript-eslint/consistent-type-imports
 * import { PanInfo, useAnimationControls, LazyMotion, domMax, m } from 'framer-motion'
 * import ClearIcon from '../../../../assets/ClearIcon.png'
 * import UnreadIcon from '../../../../assets/UnreadIcon.png'
 *
 * interface ThreadProps {
 * threadPeer: string
 * searchQuery?: string
 * lastMessage?: string
 * lastMessageTimestamp?: number
 * topic: string
 * }
 *
 * const DRAG_OFFSET = 150
 *
 * const Thread: React.FC<ThreadProps> = ({
 * topic,
 * lastMessage,
 * lastMessageTimestamp,
 * searchQuery,
 * threadPeer
 * }) => {
 * const [calculatedLastMessage, setCalculatedLastMessage] = useState<string | undefined>()
 * const [calculatedLastMsgTimestamp, setCalculatedLastMsgTimestamp] = useState<number | undefined>()
 * const { chatClientProxy } = useContext(W3iContext)
 * const dragControls = useAnimationControls()
 * const actionControls = useAnimationControls()
 *
 * useEffect(() => {
 *  if (!calculatedLastMessage && !lastMessage) {
 *    chatClientProxy?.getMessages({ topic }).then(messages => {
 *      if (messages.length) {
 *        setCalculatedLastMessage(messages[messages.length - 1].message)
 *        setCalculatedLastMsgTimestamp(messages[messages.length - 1].timestamp)
 *      }
 *    })
 *  }
 * }, [chatClientProxy, calculatedLastMessage, lastMessage, setCalculatedLastMessage])
 *
 * const handleDragEnd = (_: never, info: PanInfo) => {
 *  const shouldShowControls = info.velocity.x >= 50 || info.offset.x > DRAG_OFFSET / 2
 *  if (shouldShowControls) {
 *    dragControls.start('visible')
 *  } else {
 *    dragControls.start('hidden')
 *  }
 * }
 *
 * const handleDrag = (_: never, info: PanInfo) => {
 *  const shouldShowActions = info.velocity.x >= 0
 *  if (shouldShowActions) {
 *    actionControls.start('visible')
 *  } else {
 *    actionControls.start('hidden')
 *  }
 * }
 *
 * // On clicking a button, it should reset dragControls to hidden
 * const handleClearClick = () => {
 *  // Do more stuff here
 *  dragControls.start('hidden')
 *  actionControls.start('hidden')
 * }
 *
 * const handleUnreadClick = () => {
 *  // Do more stuff here
 *  dragControls.start('hidden')
 *  actionControls.start('hidden')
 * }
 *
 * return (
 *  <LazyMotion features={domMax}>
 *    <m.div
 *      drag="x"
 *      animate={dragControls}
 *      dragConstraints={{ left: 0, right: DRAG_OFFSET }}
 *      onDragEnd={handleDragEnd}
 *      onDrag={handleDrag}
 *      dragElastic={0.05}
 *      whileHover={{ scale: 1.01 }}
 *      dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
 *      whileDrag={{ scale: 1.02 }}
 *      initial="hidden"
 *      variants={{
 *        hidden: { x: 0 },
 *        visible: { x: DRAG_OFFSET }
 *      }}
 *      className="ThreadWrapper"
 *    >
 *      <m.div
 *        animate={actionControls}
 *        initial="hidden"
 *        variants={{
 *          hidden: { opacity: 0 },
 *          visible: { opacity: 1 }
 *        }}
 *        className="ThreadActions"
 *      >
 *        <button onClick={handleClearClick} className="ThreadActions__clear">
 *          <img src={ClearIcon} />
 *          <div className="ThreadActions__clear--text">Clear</div>
 *        </button>
 *        <button onClick={handleUnreadClick} className="ThreadActions__unread">
 *          <img src={UnreadIcon} />
 *          <div className="ThreadActions__clear--text">Unread</div>
 *        </button>
 *      </m.div>
 *      <NavLink to={`/messages/chat/${threadPeer}?topic=${topic}`}>
 *        <PeerAndMessage
 *          highlightedText={searchQuery}
 *          peer={threadPeer}
 *          message={lastMessage ?? calculatedLastMessage}
 *          timestamp={lastMessageTimestamp ?? calculatedLastMsgTimestamp}
 *        />
 *      </NavLink>
 *    </m.div>
 *  </LazyMotion>
 * )
 * }
 *
 * export default Thread
 */

import React, { useContext, useEffect, useState } from 'react'
import W3iContext from '../../../../contexts/W3iContext/context'
import NavLink from '../../../general/NavLink'
import PeerAndMessage from '../../PeerAndMessage'
import './Thread.scss'

interface ThreadProps {
  threadPeer: string
  searchQuery?: string
  lastMessage?: string
  lastMessageTimestamp?: number
  topic: string
}

const Thread: React.FC<ThreadProps> = ({
  topic,
  lastMessage,
  lastMessageTimestamp,
  searchQuery,
  threadPeer
}) => {
  const [calculatedLastMessage, setCalculatedLastMessage] = useState<string | undefined>()
  const [calculatedLastMsgTimestamp, setCalculatedLastMsgTimestamp] = useState<number | undefined>()
  const { chatClientProxy } = useContext(W3iContext)

  useEffect(() => {
    if (!calculatedLastMessage && !lastMessage) {
      chatClientProxy?.getMessages({ topic }).then(messages => {
        if (messages.length) {
          setCalculatedLastMessage(messages[messages.length - 1].message)
          setCalculatedLastMsgTimestamp(messages[messages.length - 1].timestamp)
        }
      })
    }
  }, [chatClientProxy, calculatedLastMessage, lastMessage, setCalculatedLastMessage])

  return (
    <NavLink to={`/messages/chat/${threadPeer}?topic=${topic}`}>
      <PeerAndMessage
        highlightedText={searchQuery}
        peer={threadPeer}
        message={lastMessage ?? calculatedLastMessage}
        timestamp={lastMessageTimestamp ?? calculatedLastMsgTimestamp}
      />
    </NavLink>
  )
}

export default Thread
