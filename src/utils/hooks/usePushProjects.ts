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
        ({ id, name, description, homepage, image_url, metadata }: IPushProject) => ({
          id,
          name,
          description,
          url: homepage,
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
