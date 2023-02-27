import React, { Fragment, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import W3iContext from '../../contexts/W3iContext/context'

interface AuthProtectedPageProps {
  children: React.ReactNode
}

const AuthProtectedPage: React.FC<AuthProtectedPageProps> = ({ children }) => {
  const { userPubkey } = useContext(W3iContext)

  if (!userPubkey) {
    return <Navigate to={'/login'} />
  }

  return <Fragment>{children}</Fragment>
}

export default AuthProtectedPage
