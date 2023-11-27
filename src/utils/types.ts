export interface IIconWrapper {
  shape: 'circle' | 'square' | 'standalone'
  bgColor?: 'blue' | 'green' | 'nightBlue' | 'orange' | 'pink' | 'purple' | 'turquoise'
}

export interface IIcon {
  icon: string
  alt: string
}

interface IIconWithBg extends IIcon {
  shape: IIconWrapper['shape']
  bgColor?: IIconWrapper['bgColor']
}

export interface ISection {
  title: string
  icons: IIconWithBg[]
}

export interface INotifyProject {
  id: string
  name: string
  description: string
  homepage: string
  dapp_url: string
  app: {
    browser: string
  }
  is_verified: boolean
  is_featured: boolean
  order: number | null
  image_url?: {
    sm: string
    md: string
    lg: string
  }
  metadata?: {
    shortName: string
    colors: { primary?: string; secondary?: string }
  }
}
export interface INotifyApp {
  id: string
  name: string
  description: string
  url: string
  icons: string[]
  isVerified: boolean
  isFeatured: boolean
  colors?: { primary?: string; secondary?: string }
}
