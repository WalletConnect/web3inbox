import { type Locator, type Page, expect } from '@playwright/test'

export class InboxPage {
  private readonly connectButton: Locator

  constructor(public readonly page: Page, private readonly baseURL: string) {
    this.connectButton = this.page.getByRole('button', { name: 'Connect Wallet' })
  }

  async load() {
    await this.page.goto(this.baseURL)
  }

  async gotoDiscoverPage() {
    await this.page.locator('.Sidebar__Navigation__Link[href="/notifications"]').click()
    await this.page.getByText('Discover Apps').click()

    await this.page.getByText('Discover Web3Inbox').isVisible()
  }

  assertDefined<T>(value: T | undefined | null): T {
    expect(value).toBeDefined()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return value!
  }

  async getConnectUri(): Promise<string> {
    await this.page.goto(this.baseURL)
    await this.connectButton.click()
    const connect = this.page.getByTestId('wallet-selector-walletconnect')
    await connect.waitFor({
      state: 'visible',
      timeout: 5000
    })
    await connect.click()

    // Using getByTestId() doesn't work on my machine, I'm guessing because this element is inside of a <slot>
    const qrCode = this.page.locator('wui-qr-code')
    await expect(qrCode).toBeVisible()

    return this.assertDefined(await qrCode.getAttribute('uri'))
  }

  async disconnect() {
    await this.page.getByTestId('account-button').click()
    await this.page.getByTestId('disconnect-button').click()
  }

  async promptSiwe() {
    await this.page.getByRole('button', { name: 'Sign in with wallet' }).click()
  }

  async rejectNotifications() {
    // Wait for login to succeed before checking for notifications
    // Maybe there's a race condition here, but it seems to be reliable
    await expect(this.page.locator('.Avatar').first()).toBeVisible()

    const closeButton = this.page.locator('.NotificationPwaModal__close-button').first()
    if (await closeButton.isVisible()) {
      await closeButton.click()
    }
  }

  async getAddress() {
    await this.page.locator('.Avatar').first().click()
    const address = await this.page.locator('wui-avatar').getAttribute('alt')
    await this.page.locator('wui-icon[name=close]').first().click()

    return address
  }

  async subscribe(appName: string) {
    const appCard = this.page.locator('.AppCard', {
      has: this.page.locator('.AppCard__body__title', {
        hasText: appName
      })
    })
    await appCard.locator('.AppCard__body > .AppCard__body__subscribe').click()

    await appCard
      .locator('.AppCard__body > .AppCard__body__subscribed')
      .getByText('Subscribed', { exact: false })
      .isVisible()
  }

  async navigateToNewSubscription(appName: string) {
    const appCard = this.page.locator('.AppCard', {
      has: this.page.locator('.AppCard__body__title', {
        hasText: appName
      })
    })
    const subscribeButton = appCard.getByRole('button', { name: 'Subscribed' })
    await subscribeButton.click()
    await subscribeButton.isHidden()
  }

  async subscribeAndNavigateToDapp(appName: string) {
    await this.subscribe(appName)
    await this.navigateToNewSubscription(appName)
  }

  async unsubscribe() {
    await this.page.locator('.AppNotificationsHeader__wrapper > .Dropdown').click()
    await this.page.getByRole('button', { name: 'Unsubscribe' }).click()
    await this.page.getByRole('button', { name: 'Unsubscribe' }).nth(1).click()
    await this.page.getByText('Unsubscribed from', { exact: false }).isVisible()
  }

  async navigateToDappFromSidebar(appName: string) {
    await this.page
      .locator('.AppSelector__notifications-link', {
        has: this.page.locator('.AppSelector__link__title', { hasText: appName })
      })
      .click()
  }

  /**
   * Waits for a specific number of dApps to be subscribed.
   *
   * @param {number} expectedCount - The expected number of dApps to wait for.
   * @returns {Promise<void>}
   */
  async waitForSubscriptions(expectedCount: number): Promise<void> {
    // Wait for a function that checks the length of a list or a set of elements
    // matching a certain condition to equal the expectedCount.
    await this.page.waitForFunction(
      ([className, count]) => {
        const elements = document.getElementsByClassName(className)[1].children
        return elements.length === count
      },
      ['AppSelector__list', expectedCount] as const,
      { timeout: 5000 }
    )
  }

  async updatePreferences() {
    await this.page.locator('.AppNotificationsHeader__wrapper > .Dropdown').click()
    await this.page.getByRole('button', { name: 'Preferences' }).click()
    // Ensure the modal is visible
    await this.page.getByText('Preferences').nth(1).isVisible()
    await this.page.getByText('Preferences').nth(1).click()

    const firstCheckBoxIsChecked = await this.page.isChecked('.Toggle__checkbox:nth-of-type(1)')
    await expect(this.page.locator('.Toggle__label').first()).toBeVisible()

    await this.page.locator('.Toggle').first().click()

    await this.page.getByRole('button', { name: 'Update' }).click()

    await this.page.locator('.AppNotificationsHeader__wrapper > .Dropdown').click()
    await this.page.getByRole('button', { name: 'Preferences' }).click()

    const firstCheckBoxIsCheckedAfterUpdating = await this.page.isChecked(
      '.Toggle__checkbox:nth-of-type(1)'
    )

    expect(firstCheckBoxIsChecked).not.toEqual(firstCheckBoxIsCheckedAfterUpdating)

    await this.page.locator('.PreferencesModal__close').click()
  }

  async cancelSiwe() {
    await this.page.getByTestId('w3m-connecting-siwe-cancel').click()
  }

  async switchNetwork(network: string) {
    await this.page.getByTestId('account-button').click()
    await this.page.getByTestId('w3m-account-select-network').click()
    await this.page.getByTestId(`w3m-network-switch-${network}`).click()
    await this.page.getByTestId(`w3m-header-close`).click()
  }
}
