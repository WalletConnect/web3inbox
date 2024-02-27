import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export class InboxValidator {
  constructor(public readonly page: Page) {}

  async expectConnected() {
    await expect(this.page.getByTestId('account-button')).toBeVisible()
  }

  async expectAuthenticated() {
    await expect(this.page.getByTestId('w3m-authentication-status')).toContainText('authenticated')
  }

  async expectUnauthenticated() {
    await expect(this.page.getByTestId('w3m-authentication-status')).toContainText(
      'unauthenticated'
    )
  }

  async expectSignatureDeclined() {
    await expect(this.page.getByText('Signature declined')).toBeVisible()
  }

  async expectDisconnected() {
    await expect(this.page.getByTestId('account-button')).not.toBeVisible()
  }

  async expectAcceptedSign() {
    // We use Chakra Toast and it's not quite straightforward to set the `data-testid` attribute on the toast element.
    await expect(this.page.getByText('abc')).toBeVisible()
  }

  async expectRejectedSign() {
    // We use Chakra Toast and it's not quite straightforward to set the `data-testid` attribute on the toast element.
    await expect(this.page.getByText('abc')).toBeVisible()
  }
}
