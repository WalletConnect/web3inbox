import { openDB } from 'idb'

/*
 * Key value store of:
 * (string)           -> (string)
 * Subscription Topic -> Symkey
 */
export const SYMKEY_OBJ_STORE = 'symkey-store'

/*
 * Key value store of:
 * (string)  -> (string)
 * Client ID -> FCM Token
 */
export const ECHO_REGISTRATION_STORE = 'echo-registration-store'

const STORE_NAMES = [SYMKEY_OBJ_STORE, ECHO_REGISTRATION_STORE]

/* DATABASE_VERSION should be incremented if and when any schema changes occur
 * This involves changing store names above, adding stores, or changing the schema
 * in any other way.
 */
const DATABASE_VERSION = 5

// Returns getter and setter for idb properties as it used as a key value store
export const getIndexedDbStore = async (
  storeName: string
): Promise<
  [
    (key: string) => Promise<any>,
    (key: string, value: string) => Promise<IDBValidKey>,
    () => Promise<IDBValidKey[]>,
    () => Promise<[IDBValidKey, any][]>
  ]
> => {
  const db = await openDB('w3i-push-db', DATABASE_VERSION, {
    upgrade(database) {
      // Create required access stores if they do not exist
      STORE_NAMES.forEach(store => {
        const exists = database.objectStoreNames.contains(store)
        if (!exists) {
          database.createObjectStore(store)
        }
      })
    }
  })

  const getItem = (key: string): Promise<any> => {
    return db.get(storeName, key)
  }

  const setItem = (key: string, value: string): Promise<IDBValidKey> => {
    return db.put(storeName, value, key)
  }

  const getAllKeys = (): Promise<IDBValidKey[]> => {
    return db.getAllKeys(storeName)
  }

  const getAllEntries = async (): Promise<[IDBValidKey, any][]> => {
    const transaction = db.transaction(storeName, 'readonly')

    const keys = await transaction.objectStore(storeName).getAllKeys()
    const values = await transaction.objectStore(storeName).getAll()

    transaction.commit()

    return keys.map((key, idx) => [key, values[idx]])
  }

  return [getItem, setItem, getAllKeys, getAllEntries]
}

export const getDbSymkeyStore = async () => {
  return getIndexedDbStore(SYMKEY_OBJ_STORE)
}

export const getDbEchoRegistrations = async () => {
  return getIndexedDbStore(ECHO_REGISTRATION_STORE)
}
