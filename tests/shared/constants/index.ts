import type { SessionParams } from '../types'

// Allow localhost
export const BASE_URL = process.env['BASE_URL'] || 'http://localhost:5173/'
export const WALLET_URL = process.env['WALLET_URL'] || 'https://react-wallet.walletconnect.com/'
export const DEFAULT_SESSION_PARAMS: SessionParams = {
  reqAccounts: ['1', '2'],
  optAccounts: ['1', '2'],
  accept: true
}

function getRequiredEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const CUSTOM_TEST_DAPP = {
  description: "Test description",
  icons: ["https://i.imgur.com/q9QDRXc.png"],
  name: "Notify Swift Integration Tests Prod",
  appDomain: "wc-notify-swift-integration-tests-prod.pages.dev",
  projectSecret: getRequiredEnvVar('TEST_DAPP_PROJECT_SECRET'),
  projectId: getRequiredEnvVar('TEST_DAPP_PROJECT_ID'),
  notificationType: "f173f231-a45c-4dc0-aa5d-956eb04f7360"
} as const;
