import type { Page } from '@playwright/test'

import { BASE_URL } from '../../shared/constants'

export class SettingsPage {
  private readonly baseURL = BASE_URL

  public constructor(public readonly page: Page) {}

  public async goToNotificationSettings() {
    await this.page.locator('.Sidebar__Navigation__Link[href="/settings"]').click()
  }

  public async displayCustomDapp(dappUrl: string) {
    await this.page.getByPlaceholder('app.example.com').fill(dappUrl)
    await this.page.getByRole('button', { name: 'Save', exact: true }).click()
  }
}
