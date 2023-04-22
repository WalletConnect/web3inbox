import { useEffect, useState } from 'react'
import type { IPushApp, IPushProject } from '../types'

const usePushProjects = () => {
  const [projects, setProjects] = useState<IPushApp[]>([])

  useEffect(() => {
    const fetchPushProjects = async () => {
      const explorerApiBaseUrl = import.meta.env.VITE_EXPLORER_API_URL as string | undefined
      const projectId = import.meta.env.VITE_PROJECT_ID as string | undefined
      if (!explorerApiBaseUrl) {
        throw new Error('import.meta.env.VITE_EXPLORER_API_URL is undefined')
      }
      if (!projectId) {
        throw new Error('import.meta.env.VITE_PROJECT_ID is undefined')
      }

      const explorerUrl = `${explorerApiBaseUrl}/v3/all?projectId=${projectId}&is_push_enabled=true&x=y`
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
      console.log({ pushApps })

      setProjects(pushApps)
    }
    fetchPushProjects()
  }, [])

  return projects
}

export default usePushProjects
