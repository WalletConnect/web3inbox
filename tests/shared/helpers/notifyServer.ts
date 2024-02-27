export class NotifyServer {
  private notifyBaseUrl = "https://notify.walletconnect.com"

  public async sendMessage({
    projectId,
    projectSecret,
    accounts,
    url,
    title,
    body,
    icon,
    type
  }: {
    projectId: string,
    projectSecret: string,
    accounts: string[]
    title: string,
    body: string,
    icon: string,
    url: string
    type: string
  }) {
    const request = JSON.stringify({
      accounts,
      notification: {
	title,
	body,
	icon,
	url,
	type
      }
    })

    const fetchUrl = `${this.notifyBaseUrl}/${projectId}/notify`

    const headers = new Headers({
      Authorization: `Bearer ${projectSecret}`,
      "Content-Type": "application/json"
    })

    await fetch(fetchUrl, {
      headers,
      body: request,
    })
  }
}
