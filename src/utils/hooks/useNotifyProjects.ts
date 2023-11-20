import { useContext, useEffect, useState } from 'react'
import SettingsContext from '../../contexts/SettingsContext/context'
import type { INotifyApp, INotifyProject } from '../types'
import { EXPLORER_API_BASE_URL, EXPLORER_ENDPOINTS } from '../constants'

const useNotifyProjects = () => {
  const [projects, setProjects] = useState<INotifyApp[]>([])
  const { isDevModeEnabled, filterAppDomain } = useContext(SettingsContext)

  useEffect(() => {
    const fetchNotifyProjects = async () => {
      const projectId: string = import.meta.env.VITE_PROJECT_ID

      const explorerUrl = new URL(filterAppDomain? EXPLORER_ENDPOINTS.notifyConfig : EXPLORER_ENDPOINTS.projects, EXPLORER_API_BASE_URL);
      explorerUrl.searchParams.set('projectId', projectId)

      if(filterAppDomain) {
        explorerUrl.searchParams.set('appDomain', filterAppDomain)
      }
      else {
        explorerUrl.searchParams.set('is_verified', isDevModeEnabled ? 'false' : 'true')
      }
      
      const allProjectsRawRes = await fetch(explorerUrl)
      const allNotifyProjectsRes = await allProjectsRawRes.json()

      const notifyProjects: Omit<INotifyProject, 'app'>[] = filterAppDomain
        ? [allNotifyProjectsRes.data]
        : Object.values(allNotifyProjectsRes.projects)
      const notifyApps: INotifyApp[] = notifyProjects.map(
        ({
          id,
          name,
          description,
          dapp_url,
          image_url,
          metadata,
          is_verified
        }: Omit<INotifyProject, 'app'>) => ({
          id,
          name,
          description,
          url: dapp_url,
          icons: image_url ? [image_url.md] : [],
          colors: metadata?.colors,
          isVerified: is_verified
        })
      )

      setProjects(notifyApps)
    }
    fetchNotifyProjects()
  }, [isDevModeEnabled, setProjects, filterAppDomain])

  return projects
}

export default useNotifyProjects
