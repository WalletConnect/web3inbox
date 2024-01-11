import { useState } from 'react'

export const useUiState = () => {
  const query = new URLSearchParams(window.location.search)

  const notifyEnabledQuery = query.get('notifyEnabled')
  const settingsEnabledQuery = query.get('settingsEnabled')

  const notify: boolean = notifyEnabledQuery ? JSON.parse(notifyEnabledQuery) : true
  const settings: boolean = settingsEnabledQuery ? JSON.parse(settingsEnabledQuery) : true
  // Chat is disabled by default for now

  const totalPagesEnabled = Number(notify) + Number(settings)
  const [uiEnabled] = useState({
    notify,
    settings,
    sidebar: totalPagesEnabled > 1
  })

  return { uiEnabled }
}
