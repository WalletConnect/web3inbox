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

      if (isDevModeEnabled) {
        const explorerUrl = `${explorerApiBaseUrl}/w3i/v1/submissions?projectId=${projectId}`
        const allProjectsRawRes = await fetch(explorerUrl)
        const allNotifyProjectsRes = await allProjectsRawRes.json()

        const notifyProjects: Omit<INotifyProject, 'app'>[] = Object.values(
          allNotifyProjectsRes.submissions
        )
        const notifyApps: INotifyApp[] = notifyProjects.map(
          ({
            id,
            name,
            description,
            homepage,
            image_url,
            metadata
          }: Omit<INotifyProject, 'app'>) => ({
            id,
            name,
            description,
            url: homepage,
            icons: [image_url.md],
            colors: metadata?.colors
          })
        )

        setProjects(notifyApps)

        return notifyApps
      }

      const explorerUrl = `${explorerApiBaseUrl}/v3/dapps?projectId=${projectId}&is_notify_enabled=true`
      const discoverableProjetsRawRes = await fetch(explorerUrl)
      const discoverableProjetsRes = await discoverableProjetsRawRes.json()

      const notifyProjects: INotifyProject[] = Object.values(discoverableProjetsRes.listings)
      const notifyApps: INotifyApp[] = notifyProjects.map(
        ({ id, name, description, homepage, image_url, metadata, app }: INotifyProject) => ({
          id,
          name,
          description,
          // TODO: use only `homepage` here again once we have separate gm-dapp entries between Push and Notify.
          url: app.browser || homepage,
          icons: [image_url.md],
          colors: metadata?.colors
        })
      )

      setProjects(notifyApps)

      return notifyApps
    }
    fetchNotifyProjects()
  }, [isDevModeEnabled, setProjects])

  return projects
}

export default useNotifyProjects
