export interface Cookie {
  key: string
  value: string
  samesite: 'Lax' | 'None'
  maxAgeSeconds: number
}

export const ONE_MONTH = 60 * 60 * 24 * 30

export const setCookie = (cookie: Cookie) => {
  const { key, value, samesite, maxAgeSeconds } = cookie

  const baseCookie = `${encodeURIComponent(key)}=${value}`

  const cookieString = `${baseCookie}; SameSite=${samesite}; max-age=${maxAgeSeconds}; Secure; path=/;`

  console.log('1Cookie1 Setting, ', cookieString)

  document.cookie = cookieString
}

export const readCookie = (cookieKey: string) => {
  console.log('1Cookie1 Reading from', cookieKey)
  const cookies = document.cookie.split(';')
  const foundCookie = cookies.find(value => {
    return value.startsWith(`${encodeURIComponent(cookieKey)}=`)
  })
  if (foundCookie) {
    return decodeURIComponent(foundCookie.split('=')[1])
  }

  return null
}

export const deleteCookie = (cookieKey: string) => {
  console.log('1Cookie1 Deleting', cookieKey)
  document.cookie = `${encodeURIComponent(
    cookieKey
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; path=/;`
  console.log('1Cookie1 Aftermath', document.cookie)
}
