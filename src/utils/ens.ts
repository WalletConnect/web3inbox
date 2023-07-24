import { normalize } from 'viem/ens'
import type { PublicClient } from 'wagmi'

declare const localStorage: Storage | undefined

export interface EnsRecords {
  github: string
  twitter: string
  discord: string
  url: string
  email: string
  description: string
}

export const getEnsData = async (name: string, client: PublicClient): Promise<EnsRecords> => {
  const accountEnsKey = `ens-records-${name}`

  const locallyStoredData = localStorage?.getItem(accountEnsKey)

  if (locallyStoredData) {
    return JSON.parse(locallyStoredData)
  }

  // Based on https://docs.ens.domains/ens-improvement-proposals/ensip-5-text-records
  const recordsToRetrieve: EnsRecords = {
    email: 'mail',
    description: 'description',
    twitter: 'com.twitter',
    github: 'com.github',
    url: 'url',
    discord: 'com.discord'
  }

  const records: EnsRecords = Object.fromEntries(
    await Promise.all(
      Object.entries(recordsToRetrieve).map(async ([key, recordKey]) => {
        const recordValue = await client.getEnsText({
          key: recordKey,
          name: normalize(name)
        })

        return [key, recordValue]
      })
    )
  )

  localStorage?.setItem(accountEnsKey, JSON.stringify(records))

  return records
}
