import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

/**
 * We are changing the home page from /notifications/new-app to /notifications/discover.
 * Since we have thousands of users, we might need to redirect them to the new home page in case they have the old one bookmarked.
 */
export default function AppExplorerPrevious() {
  const nav = useNavigate()

  useEffect(() => {
    nav('/notifications/discover', {
      replace: true
    })
  }, [])

  return null
}
