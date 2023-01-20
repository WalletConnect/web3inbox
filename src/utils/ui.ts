export const generateAvatarColors = (address: string) => {
  // eslint-disable-next-line require-unicode-regexp
  const seedArr = address.match(/.{1,7}/g)?.splice(0, 5)
  const colors: string[] = []

  seedArr?.forEach(seed => {
    let hash = 0
    for (let i = 0; i < seed.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      hash = seed.charCodeAt(i) + ((hash << 5) - hash)
      // eslint-disable-next-line operator-assignment, no-bitwise
      hash = hash & hash
    }

    const rgb = [0, 0, 0]
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-bitwise
      const value = (hash >> (i * 8)) & 255
      rgb[i] = value
    }
    colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
  })

  const variables = {
    '--color-av-1': colors[0],
    '--color-av-2': colors[1],
    '--color-av-3': colors[2],
    '--color-av-4': colors[3],
    '--color-av-5': colors[4]
  }

  return variables
}
