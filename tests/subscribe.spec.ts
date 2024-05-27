import { CUSTOM_TEST_DAPP, DEFAULT_SESSION_PARAMS } from './shared/constants'
import { expect, testWallet as test } from './shared/fixtures/wallet-fixture'

test.beforeEach(async ({ inboxPage, walletPage, browserName }) => {
  if (browserName === 'webkit') {
    // Clipboard doesn't work here. Remove this when we moved away from Clipboard in favor of links
    test.skip()
  }
  const uri = await inboxPage.getConnectUri()
  await walletPage.connectWithUri(uri)
  await walletPage.handleSessionProposal(DEFAULT_SESSION_PARAMS)
})

test.afterEach(async ({ inboxPage, inboxValidator, walletValidator }) => {
  await inboxPage.disconnect()
  await inboxValidator.expectDisconnected()
  await walletValidator.expectDisconnected()
})

test('it should subscribe and unsubscribe', async ({
  inboxPage,
  walletPage,
  settingsPage,
  walletValidator
}) => {
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
  walletValidator
}) => {
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
  walletValidator
}) => {
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
    const appsRead = document.getElementsByClassName('AppSelector__notifications')
    return appsRead.length > 1
  })

  await expect(inboxPage.page.locator('.AppSelector__notifications')).toHaveCount(2 + 1)

  await inboxPage.navigateToDappFromSidebar(CUSTOM_TEST_DAPP.name)
  await inboxPage.unsubscribe()
  await expect(inboxPage.page.locator('.AppSelector__notifications')).toHaveCount(1 + 1)

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
  notifyServer
}) => {
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

  // use fixed token to search for messages in a "human" way
  const messageSearchToken = 'MESSAGE_QUERY'

  const address = await inboxPage.getAddress()
  const baseMessageParams = {
    accounts: [`eip155:1:${address}`],
    type: CUSTOM_TEST_DAPP.notificationType,
    url: CUSTOM_TEST_DAPP.appDomain,
    icon: CUSTOM_TEST_DAPP.icons[0],
    projectId: CUSTOM_TEST_DAPP.projectId,
    projectSecret: CUSTOM_TEST_DAPP.projectSecret
  }

  const test1Body = `${messageSearchToken} Test1 Body`
  await notifyServer.sendMessage({
    body: test1Body,
    title: 'Test1 Title',
    ...baseMessageParams
  })

  await inboxPage.page.getByText(test1Body).waitFor({ state: 'visible' })

  expect(await inboxPage.page.getByText(test1Body).isVisible()).toEqual(true)

  const test2Body = `${messageSearchToken} Test2 Body`
  await notifyServer.sendMessage({
    body: test2Body,
    title: 'Test2 Title',
    ...baseMessageParams
  })

  await inboxPage.page.getByText(test2Body).waitFor({ state: 'visible' })

  expect(await inboxPage.page.getByText(test2Body).isVisible()).toEqual(true)

  const allMessages = await inboxPage.page.getByText(messageSearchToken, { exact: false }).all()

  // Ensure messages are ordered correctly.
  expect(await allMessages[0].innerHTML()).toEqual(test2Body)
  expect(await allMessages[1].innerHTML()).toEqual(test1Body)
})
