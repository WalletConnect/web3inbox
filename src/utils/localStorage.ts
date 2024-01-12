export class LocalStorage {
  static get(key: string) {
    if (typeof localStorage === 'undefined') {
      return undefined
    }

    return localStorage.getItem(key)
  }
  static set(key: string, value: string) {
    if (typeof localStorage === 'undefined') {
      return undefined
    }

    return localStorage.setItem(key, value)
  }
}
