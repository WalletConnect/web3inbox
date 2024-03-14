export class ArrayLogStream {
  private logs: string[]
  private MAX_LOG_SIZE = 200
  private MAX_LOG_SIZE_MARGIN = 50

  public constructor() {
    this.logs = []

    // @ts-ignore
    window.w3iLogger = this

    // @ts-ignore
    window.downloadLogsBlob = () => {
      this.downloadLogsBlobInBrowser()
      this.clearLogs()
    }
  }

  write(chunk: any): void {
    this.logs.push(JSON.stringify(chunk))

    // Using splice with a margin instead of unshift because logging
    // is a very frequent procedure and having to unshift every log after 200
    if (this.logs.length > this.MAX_LOG_SIZE + this.MAX_LOG_SIZE_MARGIN) {
      this.logs.splice(0, this.MAX_LOG_SIZE_MARGIN)
    }
  }

  public getLogs() {
    return this.logs
  }

  public clearLogs() {
    this.logs = []
  }

  public logsToBlob() {
    const blob = new Blob(this.logs, { type: 'application/json' })
    return blob
  }

  public downloadLogsBlobInBrowser() {
    const url = URL.createObjectURL(this.logsToBlob())
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'logs.json'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }
}
