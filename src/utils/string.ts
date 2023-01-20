export const truncate = (value: string, strLen = 8) => {
  if (!value) {
    return ''
  }

  if (value && value.length <= strLen) {
    return value
  }

  return `${value.substring(0, strLen)}...${value.substring(value.length - strLen)}`
}
