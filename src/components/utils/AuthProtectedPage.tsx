import React, { Fragment, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import ChatContext from '../../contexts/ChatContext/context'

interface AuthProtectedPageProps {
  children: React.ReactNode
}

const AuthProtectedPage: React.FC<AuthProtectedPageProps> = ({ children }) => {
  const { userPubkey } = useContext(ChatContext)
  if (!userPubkey) {
    return <Navigate to="/login" />
  }

  return <Fragment>{children}</Fragment>
}

export default AuthProtectedPage
