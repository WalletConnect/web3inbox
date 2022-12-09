export const truncate = (value: string, strLen = 8) => {
  if (value.length <= strLen) {
    return value
  }

  return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
}
