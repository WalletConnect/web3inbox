import { useEffect, useState } from 'react'
import type { IPushApp, IPushProject } from '../types'

const usePushProjects = () => {
  const [projects, setProjects] = useState<IPushApp[]>([])

  useEffect(() => {
    const fetchPushProjects = async () => {
      const explorerApiBaseUrl: string = import.meta.env.VITE_EXPLORER_API_URL
      const projectId: string = import.meta.env.VITE_PROJECT_ID

      const explorerUrl = `${explorerApiBaseUrl}/v3/dapps?projectId=${projectId}&is_notify_enabled=true`
      const discoverableProjetsRawRes = await fetch(explorerUrl)
      const discoverableProjetsRes = await discoverableProjetsRawRes.json()

      const pushProjects: IPushProject[] = Object.values(discoverableProjetsRes.listings)
      const pushApps: IPushApp[] = pushProjects.map(
        ({ id, name, description, homepage, image_url, metadata, app }: IPushProject) => ({
          id,
          name,
          description,
          // TODO: use only `homepage` here again once we have separate gm-dapp entries between Push and Notify.
          url: app.browser || homepage,
          icons: [image_url.md],
          colors: metadata.colors
        })
      )

      setProjects(pushApps)
    }
    fetchPushProjects()
  }, [])

  return projects
}

export default usePushProjects
