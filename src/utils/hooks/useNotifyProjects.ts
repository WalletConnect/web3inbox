import { useContext, useEffect, useState } from 'react'

import { COMING_SOON_PROJECTS } from '@/constants/projects'
import SettingsContext from '@/contexts/SettingsContext/context'
import { fetchDomainProjects, fetchFeaturedProjects } from '@/utils/projects'
import type { INotifyApp, INotifyProject, INotifyProjectWithComingSoon } from '@/utils/types'

import { logError } from '../error'

const useNotifyProjects = () => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<INotifyApp[]>([])
  const { filterAppDomain, isDevModeEnabled } = useContext(SettingsContext)

  useEffect(() => {
    const fetchNotifyProjects = async () => {
      setLoading(true)

      try {
        const { data: featuredProjects } = await fetchFeaturedProjects<INotifyProject[]>()
        const { data: domainProject } = await fetchDomainProjects<INotifyProject>(filterAppDomain)

        const allProjects: INotifyProjectWithComingSoon[] = featuredProjects.map(item => ({
          ...item,
          is_coming_soon: false
        }))

        const haveDomainProject = allProjects.some(
          ({ id }: INotifyProjectWithComingSoon) => id === domainProject?.id
        )

        const notifyApps: INotifyApp[] = allProjects
          // Lower order indicates higher priority, thus sorting ascending
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item: INotifyProjectWithComingSoon) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            url: item.dapp_url,
            icon: item.image_url?.md ?? '/fallback.svg',
            colors: item.metadata?.colors,
            isFeatured: true,
            isComingSoon: item.is_coming_soon
          }))
          .filter(app => Boolean(app.name))

        if (!haveDomainProject && domainProject) {
          notifyApps.unshift({
            id: domainProject.id,
            name: domainProject.name,
            description: domainProject.description,
            url: domainProject.dapp_url,
            icon: domainProject.image_url?.md ?? '/fallback.svg',
            isFeatured: false
          })
        }

        notifyApps.concat(COMING_SOON_PROJECTS)

        setProjects(notifyApps)
      } catch (error) {
        logError(error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifyProjects()
  }, [isDevModeEnabled, setProjects, filterAppDomain])

  return { projects, loading }
}

export default useNotifyProjects
