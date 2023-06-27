export interface Cookie {
  key: string
  value: string
  samesite: 'Lax' | 'None'
  maxAgeSeconds: number
}

export const ONE_MONTH = 60 * 60 * 24 * 30

export const setCookie = (cookie: Cookie) => {
  const { key, value, samesite, maxAgeSeconds } = cookie

  const base = `${encodeURIComponent(key)}=${value}`
  const sameSitePolicy = `SameSite=${samesite}`
  const maxAge = `max-age=${maxAgeSeconds}`
  const domain = `Domain=${window.location.host}`
  const secure = `Secure`
  const path = `path=/`

  const cookieString = `${base}; ${sameSitePolicy}; ${maxAge}; ${secure}; ${domain}; ${path};`

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
  const base = `${encodeURIComponent(cookieKey)}=`
  const expires = `expires=Thu, 01 Jan 1970 00:00:00 GMT`
  const secure = `Secure`
  const domain = `Domain=${window.location.host}`
  const path = `path=/`
  const cookieString = `${base}; ${expires}; ${secure}; ${domain}; ${path};`
  document.cookie = cookieString
  console.log('1Cookie1 Delete string', cookieString)
  console.log('1Cookie1 Aftermath', document.cookie)
}
