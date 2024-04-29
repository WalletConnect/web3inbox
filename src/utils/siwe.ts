import { Web3InboxClient } from "@web3inbox/core"
import { composeDidPkh } from '@walletconnect/did-jwt'
import { wagmiConfig } from '@/utils/wagmiConfig'
import { getAccount } from '@wagmi/core'
import { waitFor } from '@/utils/general'

import {
  SIWEVerifyMessageArgs,
  SIWECreateMessageArgs,
  formatMessage,
  getAddressFromMessage,
  getChainIdFromMessage
} from '@web3modal/siwe'

let registerParams: Awaited<ReturnType<Web3InboxClient['prepareRegistrationViaRecaps']>> | null =
  null

export const getMessageParams = async (client: Web3InboxClient | null) => {
    if (!client) {
      throw new Error('Client not ready yet')
    }

    registerParams = await client.prepareRegistrationViaRecaps({
      domain: window.location.hostname,
      allApps: true
    })

    const { cacaoPayload } = registerParams

    return {
      chains: wagmiConfig.chains.map(chain => chain.id),
      domain: cacaoPayload.domain,
      statement: cacaoPayload.statement ?? undefined,
      uri: cacaoPayload.uri,
      resources: cacaoPayload.resources
    }
}

export const createMessage = ({ address, ...args }: SIWECreateMessageArgs) => {
    if (!registerParams) {
      throw new Error("Can't create message if registerParams is undefined")
    }

    registerParams = {
      ...registerParams,
      cacaoPayload: {
        ...registerParams?.cacaoPayload,
        ...args
      }
    }

    const message = formatMessage(registerParams.cacaoPayload, address)

    // statement is generated in format message and not part of original payload.
    const statement = message.split('\n')[3]
    registerParams.cacaoPayload.statement = statement

    return message
}

export const getNonce = async () => {
  return registerParams?.cacaoPayload.nonce ?? 'FAILED_NONCE'
}

export const getSession = async (client: Web3InboxClient | null) => {
    const { address, chainId } = getAccount({ ...wagmiConfig })

    console.log('>>> getSession')

    const account = `eip155:${chainId}:${address}`
    console.log('>>> getSession for account', account)

    const identityKey = await client?.getAccountIsRegistered(account)

    const invalidSession = !(address && chainId && identityKey);

    if (invalidSession) throw new Error("Failed to get account")

    return {
      address,
      chainId,
    }
}

const verifySiweMessage = async (params: SIWEVerifyMessageArgs, client: Web3InboxClient | null) => {
  if (!client) {
    throw new Error('Failed to verify message - no client')
  }

  if (!registerParams) {
    throw new Error('Failed to verify message - no registerParams saved')
  }

  // Start signing the signature modal so it does not show up
  // in sign 2.5
  const account = composeDidPkh(
    `${getChainIdFromMessage(params.message)}:${getAddressFromMessage(params.message)}`
  )

  if (await client.getAccountIsRegistered(account)) {
    return true
  }

  // Unregister account if registered with a faulty registration.
  try {
    await client.unregister({ account })
  } catch (e) {}

  console.log({ registerParams, paramsCacao: params.cacao?.p })

  await client.register({
    registerParams: {
      allApps: true,
      cacaoPayload: {
        ...registerParams.cacaoPayload,
        ...params.cacao?.p,
        iss: account
      },
      privateIdentityKey: registerParams.privateIdentityKey
    },
    signature: params.signature
  })

  return true
}

export const verifyMessage = async (params: SIWEVerifyMessageArgs, client: Web3InboxClient | null) => {
    try {
      const messageIsValid = await verifySiweMessage(params, client)

      const account = `${getChainIdFromMessage(params.message)}:${getAddressFromMessage(params.message)}`;

      if(messageIsValid) {
	await waitFor(() => client!.getAccountIsRegistered(account))
      }

      return messageIsValid
    } catch (e) {
      return false
    }
}

