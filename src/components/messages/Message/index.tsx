import React from 'react'
import './Message.scss'
import { m, LazyMotion, domAnimation } from 'framer-motion'

interface MessageProps {
  text: string
  from: 'peer' | 'sender'
}

const Message: React.FC<MessageProps> = ({ text, from }) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div className={`Message Message__from-${from}`}>
        <m.div
          initial={{
            opacity: 0,
            scale: 0,
            transformOrigin: `bottom ${from === 'peer' ? 'left' : 'right'}`
          }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="Message__bubble"
        >
          {text}
        </m.div>
      </m.div>
    </LazyMotion>
  )
}

export default Message
