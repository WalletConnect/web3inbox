import React from 'react'

import { LazyMotion, domAnimation, m } from 'framer-motion'

import Text from '@/components/general/Text'

import './Message.scss'

interface MessageProps {
  text: string
  from: 'peer' | 'sender'
  status?: 'failed' | 'pending' | 'sent'
}

const Message: React.FC<MessageProps> = ({ text, from, status }) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div className={`Message Message__from-${from} ${status ? `Message__${status}` : ''}`}>
        <m.div
          initial={{
            opacity: 0,
            scale: 0,
            transformOrigin: `bottom ${from === 'peer' ? 'left' : 'right'}`
          }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="Message__bubble"
        >
          <Text variant="small-400">{text}</Text>
        </m.div>
      </m.div>
    </LazyMotion>
  )
}

export default Message
