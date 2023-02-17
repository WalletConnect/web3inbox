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
