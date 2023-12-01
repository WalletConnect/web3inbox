import React, { Fragment, useContext } from 'react'

import { Navigate, useLocation } from 'react-router-dom'

import W3iContext from '@/contexts/W3iContext/context'

interface AuthProtectedPageProps {
  children: React.ReactNode
}

const AuthProtectedPage: React.FC<AuthProtectedPageProps> = ({ children }) => {
  const { userPubkey, authProvider } = useContext(W3iContext)
  const loc = useLocation()
  const next = `${loc.pathname}${loc.search}`

  if (!userPubkey && authProvider === 'internal') {
    const query = next.length > 1 ? `?next=${encodeURIComponent(next)}` : ''

    return <Navigate to={`/login${query}`} />
  }

  return <Fragment>{children}</Fragment>
}

export default AuthProtectedPage
