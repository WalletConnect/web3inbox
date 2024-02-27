import { DEFAULT_SESSION_PARAMS } from './shared/constants'
import { expect, testWallet as test } from './shared/fixtures/wallet-fixture'

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

test('it should subscribe and unsubscribe to and from multiple dapps', async ({
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
  await inboxPage.subscribe(0)
  await inboxPage.subscribe(1)
  expect(await inboxPage.countSubscribedDapps()).toEqual(2);

  await inboxPage.navigateToDappFromSidebar(0);
  await inboxPage.unsubscribe()
  expect(await inboxPage.countSubscribedDapps()).toEqual(1);

  // select 0 again since we unsubscribed from the second dapp
  // so there is only one item
  await inboxPage.navigateToDappFromSidebar(0);
  await inboxPage.unsubscribe()
})
