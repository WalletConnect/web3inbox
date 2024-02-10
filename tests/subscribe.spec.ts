import { DEFAULT_SESSION_PARAMS } from './shared/constants'
import { testWallet as test } from './shared/fixtures/wallet-fixture'

test.beforeEach(async ({ modalPage, walletPage, browserName }) => {
  if (browserName === 'webkit') {
    // Clipboard doesn't work here. Remove this when we moved away from Clipboard in favor of links
    test.skip()
  }
  await modalPage.copyConnectUriToClipboard()
  await walletPage.connect()
  await walletPage.handleSessionProposal(DEFAULT_SESSION_PARAMS)
})

test.afterEach(async ({ modalValidator, walletValidator }) => {
  await modalValidator.expectDisconnected()
  await walletValidator.expectDisconnected()
})

test('it should subscribe and unsubscribe', async ({
  modalPage,
  walletPage,
  walletValidator,
  browserName
}) => {
  if (browserName === 'webkit') {
    // Clipboard doesn't work here. Remove this when we moved away from Clipboard in favor of links
    test.skip()
  }
  await modalPage.promptSiwe()
  await walletValidator.expectReceivedSign({})
  await walletPage.handleRequest({ accept: true })
  await modalPage.rejectNotifications()
  await modalPage.subscribe(0)
  await modalPage.unsubscribe(0)
})
