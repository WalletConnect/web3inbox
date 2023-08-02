/* eslint-disable no-bitwise */

const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex, 16)

  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [r, g, b]
}

const tintColor = (rgb: [number, number, number], tint: number): [number, number, number] => {
  const [r, g, b] = rgb
  const tintedR = Math.round(r + (255 - r) * tint)
  const tintedG = Math.round(g + (255 - g) * tint)
  const tintedB = Math.round(b + (255 - b) * tint)

  return [tintedR, tintedG, tintedB]
}

export const generateAvatarColors = (address: string) => {
  const hash = address.toLowerCase().replace(/^0x/iu, '')
  const baseColor = hash.substring(0, 6)
  const rgbColor = hexToRgb(baseColor)

  const colors: string[] = []

  for (let i = 0; i < 5; i += 1) {
    const tintedColor = tintColor(rgbColor, 0.15 * i)
    colors.push(`rgb(${tintedColor[0]}, ${tintedColor[1]}, ${tintedColor[2]})`)
  }

  const variables = {
    '--local-color-1': colors[0],
    '--local-color-2': colors[1],
    '--local-color-3': colors[2],
    '--local-color-4': colors[3],
    '--local-color-5': colors[4]
  }

  return variables
}

export const isMobile = () => {
  return window.innerWidth < 700
}

export const handleImageFallback = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement
  target.onerror = null
  target.src = '/fallback.svg'
}
