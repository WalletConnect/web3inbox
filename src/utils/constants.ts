export const SERVICE_WORKER_ACTIONS = {
  SKIP_WAITING: 'SKIP_WAITING',
  SET_SUBS_SYMKEYS: 'SET_SUBS_SYMKEYS',
  REGISTER_WITH_ECHO: 'REGISTER_WITH_ECHO'
}

export const EXPLORER_API_BASE_URL: string = import.meta.env.VITE_EXPLORER_API_URL

export const EXPLORER_ENDPOINTS = {
  projects: '/w3i/v1/projects',
  notifyConfig: '/w3i/v1/notify-config'
}
