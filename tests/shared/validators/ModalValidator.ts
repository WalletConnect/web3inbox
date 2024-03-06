import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export class InboxValidator {
  public constructor(public readonly page: Page) {}

  public async expectConnected() {
    await expect(this.page.getByTestId('account-button')).toBeVisible()
  }

  public async expectAuthenticated() {
    await expect(this.page.getByTestId('w3m-authentication-status')).toContainText('authenticated')
  }

  public async expectUnauthenticated() {
    await expect(this.page.getByTestId('w3m-authentication-status')).toContainText(
      'unauthenticated'
    )
  }

  public async expectSignatureDeclined() {
    await expect(this.page.getByText('Signature declined')).toBeVisible()
  }

  public async expectDisconnected() {
    await expect(this.page.getByTestId('account-button')).not.toBeVisible()
  }

  public async expectAcceptedSign() {
    // We use Chakra Toast and it's not quite straightforward to set the `data-testid` attribute on the toast element.
    await expect(this.page.getByText('abc')).toBeVisible()
  }

  public async expectRejectedSign() {
    // We use Chakra Toast and it's not quite straightforward to set the `data-testid` attribute on the toast element.
    await expect(this.page.getByText('abc')).toBeVisible()
  }
}
