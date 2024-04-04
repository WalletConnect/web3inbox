import { CUSTOM_TEST_DAPP, DEFAULT_SESSION_PARAMS } from './shared/constants'
import { expect, testWallet as test } from './shared/fixtures/wallet-fixture'
import { uploadCanaryResultsToCloudWatch } from './shared/utils/metrics'

const ENV = process.env['ENVIRONMENT'] || 'dev'
const REGION = process.env['REGION'] || 'eu-central-1'

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

  let startTime = Date.now()

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

  if (ENV !== 'dev') {
    const duration: number = Date.now() - startTime
    await uploadCanaryResultsToCloudWatch(
      ENV,
      REGION,
      'https://app.web3inbox.com/',
      'HappyPath.subscribe',
      true,
      duration
    )
  }
})
