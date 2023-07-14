import { useEffect, useState } from 'react'

export const useUiState = () => {
  const query = new URLSearchParams(window.location.search)

  const pushEnabledQuery = query.get('pushEnabled')
  const chatEnabledQuery = query.get('chatEnabled')
  const settingsEnabledQuery = query.get('settingsEnabled')

  const push: boolean = pushEnabledQuery ? JSON.parse(pushEnabledQuery) : true
  const settings: boolean = settingsEnabledQuery ? JSON.parse(settingsEnabledQuery) : true
  const chat: boolean = chatEnabledQuery ? JSON.parse(chatEnabledQuery) : true

  const totalPagesEnabled = Number(push) + Number(settings) + Number(chat)
  const [uiEnabled] = useState({
    push,
    settings,
    chat,
    sidebar: totalPagesEnabled > 1
  })

  const uiDappContextQuery = query.get('dappContext')

  const [dappContext, setDappContext] = useState<string>(uiDappContextQuery ?? '')

  useEffect(() => {
    if (uiDappContextQuery) {
      setDappContext(uiDappContextQuery)
    }
  }, [uiDappContextQuery, setDappContext])

  return { uiEnabled, dappContext }
}
