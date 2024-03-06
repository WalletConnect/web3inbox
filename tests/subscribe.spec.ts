import { CUSTOM_TEST_DAPP, DEFAULT_SESSION_PARAMS } from './shared/constants'
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
  settingsPage,
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

  await settingsPage.goToNotificationSettings()
  await settingsPage.displayCustomDapp(CUSTOM_TEST_DAPP.appDomain)
  await inboxPage.gotoDiscoverPage()

  await inboxPage.subscribeAndNavigateToDapp(CUSTOM_TEST_DAPP.name)
  await inboxPage.unsubscribe()
})

test('it should subscribe, update preferences and unsubscribe', async ({
  inboxPage,
  walletPage,
  settingsPage,
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

  await settingsPage.goToNotificationSettings()
  await settingsPage.displayCustomDapp(CUSTOM_TEST_DAPP.appDomain)
  await inboxPage.gotoDiscoverPage()

  await inboxPage.subscribeAndNavigateToDapp(CUSTOM_TEST_DAPP.name)
  await inboxPage.updatePreferences()
  await inboxPage.unsubscribe()
})

test('it should subscribe and unsubscribe to and from multiple dapps', async ({
  inboxPage,
  walletPage,
  settingsPage,
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

  await settingsPage.goToNotificationSettings()
  await settingsPage.displayCustomDapp(CUSTOM_TEST_DAPP.appDomain)
  await inboxPage.gotoDiscoverPage()

  await inboxPage.subscribe(CUSTOM_TEST_DAPP.name)
  await inboxPage.subscribe('GM Dapp')

  await inboxPage.waitForSubscriptions(2)

  // Wait for the 2 dapps to be subscribed to.
  await inboxPage.page.waitForFunction(() => {
    // Using 1 here since the first `AppSelector__list` is the one with `Discover Apps`
    const apps = document.getElementsByClassName('AppSelector__list')[1].children.length
    return apps === 2
  })

  expect(await inboxPage.countSubscribedDapps()).toEqual(2)

  await inboxPage.navigateToDappFromSidebar(CUSTOM_TEST_DAPP.name)
  await inboxPage.unsubscribe()
  expect(await inboxPage.countSubscribedDapps()).toEqual(1)

  // select 0 again since we unsubscribed from the second dapp
  // so there is only one item
  await inboxPage.navigateToDappFromSidebar('GM Dapp')
  await inboxPage.unsubscribe()
})

test('it should subscribe, receive messages and unsubscribe', async ({
  inboxPage,
  walletPage,
  settingsPage,
  walletValidator,
  browserName,
  notifyServer
}) => {
  if (browserName === 'webkit') {
    // Clipboard doesn't work here. Remove this when we moved away from Clipboard in favor of links
    test.skip()
  }
  await inboxPage.promptSiwe()
  await walletValidator.expectReceivedSign({})
  await walletPage.handleRequest({ accept: true })
  await inboxPage.rejectNotifications()

  await settingsPage.goToNotificationSettings()
  await settingsPage.displayCustomDapp(CUSTOM_TEST_DAPP.appDomain)

  await inboxPage.gotoDiscoverPage()

  // Ensure the custom dapp is the one subscribed to
  await inboxPage.page.getByText('Notify Swift', { exact: false }).waitFor({ state: 'visible' })

  expect(await inboxPage.page.getByText('Notify Swift', { exact: false }).isVisible()).toEqual(true)
  
  await inboxPage.subscribeAndNavigateToDapp(CUSTOM_TEST_DAPP.name)

  const address = await inboxPage.getAddress()

  await notifyServer.sendMessage({
    accounts: [`eip155:1:${address}`],
    body: 'Test Body',
    title: 'Test Title',
    type: CUSTOM_TEST_DAPP.notificationType,
    url: CUSTOM_TEST_DAPP.appDomain,
    icon: CUSTOM_TEST_DAPP.icons[0],
    projectId: CUSTOM_TEST_DAPP.projectId,
    projectSecret: CUSTOM_TEST_DAPP.projectSecret
  })

  await inboxPage.page.getByText('Test Body').waitFor({ state: 'visible' })

  expect(await inboxPage.page.getByText('Test Body').isVisible()).toEqual(true)
})
