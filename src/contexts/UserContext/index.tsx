import React, { useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import UserContext from './context'
import ChatContext from '../ChatContext/context'

interface ChatContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const UserContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const { address } = useAccount()
  const { chatClientProxy } = useContext(ChatContext)

  const [userPubkey, setUserPubkey] = useState<string | undefined>(undefined)

  useEffect(() => {
    chatClientProxy?.observe('chat_account_change', {
      next: ({ account }) => {
        setUserPubkey(account)
      }
    })
  }, [chatClientProxy])

  useEffect(() => {
    if (address) {
      setUserPubkey(address)
    }
  }, [address])

  return <UserContext.Provider value={{ userPubkey }}>{children}</UserContext.Provider>
}

export default UserContextProvider
