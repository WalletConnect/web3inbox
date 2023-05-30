import { useEffect, useState } from 'react'

export const useUiState = () => {
  const query = new URLSearchParams(window.location.search)

  const pushEnabledQuery = query.get('pushEnabled')
  const chatEnabledQuery = query.get('chatEnabled')
  const settingsEnabledQuery = query.get('settingsEnabled')

  const [uiEnabled, setUiEnabled] = useState({
    push: pushEnabledQuery ? JSON.parse(pushEnabledQuery) : true,
    settings: settingsEnabledQuery ? JSON.parse(settingsEnabledQuery) : true,
    chat: chatEnabledQuery ? JSON.parse(chatEnabledQuery) : true,
    sidebar: false
  })

  useEffect(() => {
    setUiEnabled(oldUiEnabled => {
      const totalPagesEnabled = Object.values(oldUiEnabled).reduce<number>(
        (pagesAvailable, pageEnabled) => (pageEnabled ? pagesAvailable + 1 : pagesAvailable),
        0
      )
      if (totalPagesEnabled) {
        return { ...oldUiEnabled, sidebar: true }
      }

      return oldUiEnabled
    })
  }, [])

  return { uiEnabled }
}
