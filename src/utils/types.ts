export interface IIconWrapper {
  shape: 'circle' | 'square' | 'stand-alone'
  bgColor?: 'blue' | 'green' | 'nightBlue' | 'orange' | 'pink' | 'purple' | 'turquoise'
}

export interface IICon {
  icon: string
  alt: string
}

interface IIconWithBg extends IICon {
  shape: IIconWrapper['shape']
  bgColor?: IIconWrapper['bgColor']
}

export interface ISection {
  title: string
  icons: IIconWithBg[]
}
