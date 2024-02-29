import { type Locator, type Page, expect } from '@playwright/test'

import { BASE_URL } from '../constants'

export class InboxPage {
  private readonly baseURL = BASE_URL

  private readonly connectButton: Locator

  constructor(public readonly page: Page) {
    this.connectButton = this.page.getByRole('button', { name: 'Connect Wallet' })
  }

  async load() {
    await this.page.goto(this.baseURL)
  }

  async gotoDiscoverPage() {
    await this.page.locator('.Sidebar__Navigation__Link[href="/notifications"]').click()
    await this.page.getByText('Discover Apps').click();

    await this.page.getByText('Discover Web3Inbox').isVisible();
  }

  async copyConnectUriToClipboard() {
    await this.page.goto(this.baseURL)
    await this.connectButton.click()
    await this.page.getByTestId('wallet-selector-walletconnect').click()
    await this.page.waitForTimeout(2000)
    await this.page.getByTestId('copy-wc2-uri').click()
  }

  async disconnect() {
    await this.page.getByTestId('account-button').click()
    await this.page.getByTestId('disconnect-button').click()
  }

  async promptSiwe() {
    await this.page.getByRole('button', { name: 'Sign in with wallet' }).click()
  }

  async rejectNotifications() {
    // Allow for the modal to pop up
    await this.page.waitForTimeout(4000)
    const isVisible = (await this.page.locator('.NotificationPwaModal__close-button').count()) > 0
    if (!isVisible) return
    await this.page.locator('.NotificationPwaModal__close-button').first().click()
  }

  async getAddress() {
    await this.page.locator('.Avatar').first().click()
    const address = await this.page.locator('wui-avatar').getAttribute('alt')
    await this.page.locator('wui-icon[name=close]').first().click();

    return address;
  }

  async subscribe(nth: number) {
    const appCard = this.page.locator('.AppCard__body').nth(nth)
    await appCard.locator('.AppCard__body__subscribe').click()

    await appCard.locator('.AppCard__body__subscribed').getByText('Subscribed', { exact: false }).isVisible()
  }

  async navigateToNewSubscription(nth: number) {
    await this.page.getByRole('button', { name: 'Subscribed' }).nth(nth).click()
    await this.page.getByRole('button', { name: 'Subscribed' }).nth(nth).isHidden()
  }

  async subscribeAndNavigateToDapp(nth: number) {
    await this.subscribe(nth);
    await this.navigateToNewSubscription(nth);
  }

  async unsubscribe() {
    await this.page.locator('.AppNotificationsHeader__wrapper > .Dropdown').click()
    await this.page.getByRole('button', { name: 'Unsubscribe' }).click()
    await this.page.getByRole('button', { name: 'Unsubscribe' }).nth(1).click()
    await this.page.getByText('Unsubscribed from', { exact: false }).isVisible()
    await this.page.waitForTimeout(2000)
  }

  async navigateToDappFromSidebar(nth: number) {
    await this.page.locator('.AppSelector__notifications-link').nth(nth).click()
  }

  async countSubscribedDapps() {
    const notificationsCount = await this.page.locator('.AppSelector__notifications').count()
    
    return notificationsCount - 1;
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
    await this.page.waitForFunction(([className, count]) => {
      const elements = document.getElementsByClassName(className)[1].children;;
      return elements.length === count;
    }, ['AppSelector__list', expectedCount] as const, { timeout: 5000 }); 
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

    const firstCheckBoxIsCheckedAfterUpdating =  await this.page.isChecked('.Toggle__checkbox:nth-of-type(1)')

    expect(firstCheckBoxIsChecked).not.toEqual(firstCheckBoxIsCheckedAfterUpdating)

    await this.page.locator('.PreferencesModal__close').click();
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
