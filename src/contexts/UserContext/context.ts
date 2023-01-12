import { createContext } from 'react'

interface UserContextState {
  userPubkey: string | undefined
}

const UserContext = createContext<UserContextState>({
  userPubkey: undefined
})

export default UserContext
