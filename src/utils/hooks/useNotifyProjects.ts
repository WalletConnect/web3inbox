import { useContext, useEffect, useState } from 'react'
import SettingsContext from '../../contexts/SettingsContext/context'
import type { INotifyApp, INotifyProject } from '../types'

const useNotifyProjects = () => {
  const [projects, setProjects] = useState<INotifyApp[]>([])
  const { isDevModeEnabled } = useContext(SettingsContext)

  useEffect(() => {
    const fetchNotifyProjects = async () => {
      const explorerApiBaseUrl: string = import.meta.env.VITE_EXPLORER_API_URL
      const projectId: string = import.meta.env.VITE_PROJECT_ID

      const explorerUrl = `${explorerApiBaseUrl}/w3i/v1/projects?projectId=${projectId}&is_verified=${
        isDevModeEnabled ? 'false' : 'true'
      }`
      const allProjectsRawRes = await fetch(explorerUrl)
      const allNotifyProjectsRes = await allProjectsRawRes.json()

      const notifyProjects: Omit<INotifyProject, 'app'>[] = Object.values(
        allNotifyProjectsRes.projects
      )
      const notifyApps: INotifyApp[] = notifyProjects.map(
        ({
          id,
          name,
          description,
          dapp_url,
          image_url,
          metadata
        }: Omit<INotifyProject, 'app'>) => ({
          id,
          name,
          description,
          url: dapp_url,
          icons: [image_url.md],
          colors: metadata?.colors
        })
      )

      setProjects(notifyApps)
    }
    fetchNotifyProjects()
  }, [isDevModeEnabled, setProjects])

  return projects
}

export default useNotifyProjects
