import { INotifyProjectWithComingSoon } from '@/utils/types'

export const COMING_SOON_PROJECTS: Array<INotifyProjectWithComingSoon> = [
  {
    id: 'peanut',
    name: 'Peanut',
    description: 'Get notified when friends receive and claim your payments.',
    homepage: 'https://peanut.to',
    dapp_url: 'https://peanut.to',
    app: {
      browser: 'https://peanut.to'
    },
    is_verified: false,
    is_featured: false,
    is_coming_soon: true,
    order: 0,
    image_url: {
      sm: '',
      md: '',
      lg: ''
    },
    metadata: {
      shortName: 'Peanut',
      colors: {
        primary: '#00FF00',
        secondary: '#00FF00'
      }
    }
  }
]
