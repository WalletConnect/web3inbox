import { type Locator, type Page, expect } from '@playwright/test'

import { BASE_URL } from '../constants'

export class ModalPage {
  private readonly baseURL = BASE_URL

  private readonly connectButton: Locator

  constructor(public readonly page: Page) {
    this.connectButton = this.page.getByRole('button', { name: 'Connect Wallet' })
  }

  async load() {
    await this.page.goto(this.baseURL)
    await this.page.context().grantPermissions(['notifications'])
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

  async subscribe(nth: number) {
    await this.page.locator('.AppCard__body > .AppCard__body__subscribe').nth(nth).click()
    await this.page.getByText('Subscribed to', { exact: false }).isVisible()
  }

  async unsubscribe(nth: number) {
    await this.page.getByRole('button', { name: 'Subscribed' }).nth(nth).click()
    await this.page.getByRole('button', { name: 'Subscribed' }).nth(nth).isHidden()
    await this.page.locator('.AppNotificationsHeader__wrapper > .Dropdown').click()
    await this.page.getByRole('button', { name: 'Unsubscribe' }).click()
    await this.page.getByRole('button', { name: 'Unsubscribe' }).nth(1).click()
    await this.page.getByText('Unsubscribed from', { exact: false }).isVisible()
    await this.page.waitForTimeout(2000)
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
