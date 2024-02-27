import { DEFAULT_SESSION_PARAMS } from './shared/constants'
import { testWallet as test } from './shared/fixtures/wallet-fixture'

test.beforeEach(async ({ inboxPage, walletPage, browserName }) => {
  if (browserName === 'webkit') {
    // Clipboard doesn't work here. Remove this when we moved away from Clipboard in favor of links
    test.skip()
  }
  await inboxPage.copyConnectUriToClipboard()
  await walletPage.connect()
  await walletPage.handleSessionProposal(DEFAULT_SESSION_PARAMS)
})

test.afterEach(async ({ inboxValidator, walletValidator }) => {
  await inboxValidator.expectDisconnected()
  await walletValidator.expectDisconnected()
})

test('it should subscribe and unsubscribe', async ({
  inboxPage,
  walletPage,
  walletValidator,
  browserName
}) => {
  if (browserName === 'webkit') {
    // Clipboard doesn't work here. Remove this when we moved away from Clipboard in favor of links
    test.skip()
  }
  await inboxPage.promptSiwe()
  await walletValidator.expectReceivedSign({})
  await walletPage.handleRequest({ accept: true })
  await inboxPage.rejectNotifications()
  await inboxPage.subscribeAndNavigateToDapp(0)
  await inboxPage.unsubscribe()
})

test('it should subscribe, update preferences and unsubscribe', async ({
  inboxPage,
  walletPage,
  walletValidator,
  browserName
}) => {
  if (browserName === 'webkit') {
    // Clipboard doesn't work here. Remove this when we moved away from Clipboard in favor of links
    test.skip()
  }
  await inboxPage.promptSiwe()
  await walletValidator.expectReceivedSign({})
  await walletPage.handleRequest({ accept: true })
  await inboxPage.rejectNotifications()
  await inboxPage.subscribeAndNavigateToDapp(0)
  await inboxPage.updatePreferences()
  await inboxPage.unsubscribe()
})
