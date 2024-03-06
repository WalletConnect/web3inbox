import type { Page } from '@playwright/test'

export class DeviceRegistrationPage {
  public constructor(
    public readonly page: Page,
    public readonly url: string
  ) {}

  public async load() {
    await this.page.goto(this.url)
  }

  public async approveDevice() {
    await this.page.getByRole('button', { name: 'Approve' }).click()
  }
}
