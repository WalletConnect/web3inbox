import { useContext, useEffect, useState } from 'react'

import { COMING_SOON_PROJECTS } from '@/constants/projects'
import SettingsContext from '@/contexts/SettingsContext/context'
import { EXPLORER_API_BASE_URL, EXPLORER_ENDPOINTS } from '@/utils/constants'
import type { INotifyApp, INotifyProjectWithComingSoon } from '@/utils/types'

const projectId: string = import.meta.env.VITE_PROJECT_ID

const useNotifyProjects = () => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<INotifyApp[]>([])
  const { filterAppDomain } = useContext(SettingsContext)

  useEffect(() => {
    const fetchNotifyProjects = async () => {
      setLoading(true)

      const explorerUrlFeatured = new URL(EXPLORER_ENDPOINTS.projects, EXPLORER_API_BASE_URL)
      const explorerUrlAppDomain = new URL(EXPLORER_ENDPOINTS.notifyConfig, EXPLORER_API_BASE_URL)

      explorerUrlFeatured.searchParams.set('projectId', projectId)
      explorerUrlFeatured.searchParams.set('isVerified', 'true')
      explorerUrlFeatured.searchParams.set('isFeatured', 'true')
      explorerUrlAppDomain.searchParams.set('projectId', projectId)

      const discoverProjectsResponse = await fetch(explorerUrlFeatured)
      const discoverProjectsData = await discoverProjectsResponse.json()
      const discoverProjects = Object.values(
        discoverProjectsData.projects
      ) as INotifyProjectWithComingSoon[]

      let domainProjects: INotifyProjectWithComingSoon[] = []
      if (filterAppDomain) {
        explorerUrlAppDomain.searchParams.set('appDomain', filterAppDomain)
        const domainProjectsResponse = await fetch(explorerUrlAppDomain)
        if (domainProjectsResponse.ok) {
          const domainProjectsData = await domainProjectsResponse.json()
          domainProjects = [domainProjectsData.data] as INotifyProjectWithComingSoon[]
        }
      }

      const allProjects: INotifyProjectWithComingSoon[] = discoverProjects.concat(domainProjects)
      const notifyApps: INotifyApp[] = allProjects
        // Lower order indicates higher priority, thus sorting ascending
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(
          ({
            id,
            name,
            description,
            dapp_url,
            image_url,
            metadata,
            is_verified,
            is_featured,
            isVerified,
            is_coming_soon
          }: INotifyProjectWithComingSoon) => ({
            id,
            name,
            description,
            url: dapp_url,
            icon: image_url?.md ?? '/fallback.svg',
            colors: metadata?.colors,
            isVerified: is_verified || isVerified ? true : false,
            isFeatured: is_featured,
            isComingSoon: is_coming_soon
          })
        )
        .filter(app => Boolean(app.name))

      notifyApps.concat(COMING_SOON_PROJECTS)

      setLoading(false)
      setProjects(notifyApps)
    }
    fetchNotifyProjects()
  }, [setProjects, filterAppDomain])

  return { projects, loading }
}

export default useNotifyProjects
