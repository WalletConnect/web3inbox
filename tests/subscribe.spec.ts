import { DEFAULT_SESSION_PARAMS } from './shared/constants'
import { testWallet as test } from './shared/fixtures/wallet-fixture'

test.beforeEach(async ({ modalPage, walletPage }) => {
  await modalPage.copyConnectUriToClipboard()
  await walletPage.connect()
  await walletPage.handleSessionProposal(DEFAULT_SESSION_PARAMS)
})

test.afterEach(async ({ modalValidator, walletValidator }) => {
  await modalValidator.expectDisconnected()
  await walletValidator.expectDisconnected()
})

test('it should subscribe and unsubscribe', async ({ modalPage, walletPage, walletValidator }) => {
  await modalPage.promptSiwe()
  await walletValidator.expectReceivedSign({})
  await walletPage.handleRequest({ accept: true })
  await modalPage.rejectNotifications()
  await modalPage.subscribe(0)
  await modalPage.unsubscribe()
})
