import mixpanel from 'mixpanel-browser'

export const identifyMixpanelUserAndInit = (token: string) => {
  mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, { debug: true, persistence: 'localStorage' })

  mixpanel.identify(token)
}
