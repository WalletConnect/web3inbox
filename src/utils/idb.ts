import { IDBPDatabase, openDB } from 'idb'

export const SYMKEY_OBJ_STORE = 'symkey-store'
export const ECHO_REGISTRATION_STORE = 'symkey-store'

// Returns getter and setter for idb properties as it used as a key value store
export const getIndexedDbStore = async (
  storeName: string
): Promise<
  [(key: string) => Promise<any>, (key: string, value: string) => Promise<IDBValidKey>]
> => {
  const db = await openDB('w3i-push-db', 3, {
    upgrade(database) {
      const exists = database.objectStoreNames.contains(storeName)
      if (!exists) {
        database.createObjectStore(storeName)
      }
    }
  })

  return [
    (key: string) => {
      return db.get(storeName, key)
    },
    (key: string, value: string) => {
      return db.put(storeName, value, key)
    }
  ]
}

export const getDbSymkeyStore = async () => {
  return getIndexedDbStore(SYMKEY_OBJ_STORE)
}

export const getDbEchoRegistrations = async () => {
  return getIndexedDbStore(ECHO_REGISTRATION_STORE)
}
