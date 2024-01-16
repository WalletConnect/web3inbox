import { EXPLORER_API_BASE_URL, EXPLORER_ENDPOINTS } from '@/utils/constants'

import { logError } from './error'

const projectId: string = import.meta.env.VITE_PROJECT_ID

export async function fetchFeaturedProjects<T>() {
  const explorerUrlFeatured = new URL(EXPLORER_ENDPOINTS.projects, EXPLORER_API_BASE_URL)

  explorerUrlFeatured.searchParams.set('projectId', projectId)
  explorerUrlFeatured.searchParams.set('isVerified', 'true')
  explorerUrlFeatured.searchParams.set('isFeatured', 'true')

  try {
    const discoverProjectsData = await fetch(explorerUrlFeatured).then(async res => res.json())
    const discoverProjects = Object.values(discoverProjectsData.projects)

    return {
      data: discoverProjects as T
    }
  } catch (error) {
    logError(error)
    throw new Error(`Error fetching featured projects: ${error}`)
  }
}

export async function fetchDomainProjects<T>(domain: string) {
  if (!domain) {
    return { data: null }
  }

  let domainProject: T | null = null

  const explorerUrlAppDomain = new URL(EXPLORER_ENDPOINTS.notifyConfig, EXPLORER_API_BASE_URL)
  explorerUrlAppDomain.searchParams.set('projectId', projectId)
  explorerUrlAppDomain.searchParams.set('appDomain', domain)

  try {
    const domainProjectsData = await fetch(explorerUrlAppDomain).then(async res => res.json())
    domainProject = domainProjectsData.data as T

    return {
      data: domainProject
    }
  } catch (error) {
    throw new Error(`Error fetching projects for domain: ${error}`)
  }
}
