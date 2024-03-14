export interface LogClientMetadata {
  clientId: string
}

export class ArrayLogStream {
  private logs: string[]
  private MAX_LOG_SIZE = 1000
  private MAX_LOG_SIZE_MARGIN = 50

  public constructor() {
    this.logs = []

    // @ts-ignore
    window.w3iLogger = this

    // @ts-ignore
    window.downloadLogsBlob = () => {
      this.downloadLogsBlobInBrowser({ clientId: 'N/A' })
      this.clearLogs()
    }
  }

  write(chunk: any): void {
    this.logs.push(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        log: chunk
      })
    )

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

  public logsToBlob(clientMetadata: LogClientMetadata) {
    this.logs.push(JSON.stringify({ clientMetadata }))
    const blob = new Blob(this.logs, { type: 'application/json' })
    return blob
  }

  public downloadLogsBlobInBrowser(clientMetadata: LogClientMetadata) {
    const url = URL.createObjectURL(this.logsToBlob(clientMetadata))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `w3i-logs-${new Date().toISOString()}.txt`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }
}
