export class ArrayLogStream {
  private logs: string[]

  public constructor() {
    this.logs = []


    // @ts-ignore
    window.w3iLogger = this;

    // @ts-ignore
    window.downloadLogsBlob = () => {
      this.downloadLogsBlobInBrowser()
      this.clearLogs()
    }
  }

  write(chunk: any): void {
    this.logs.push(JSON.stringify(chunk));
  }

  public getLogs() {
    return this.logs;
  }

  public clearLogs() {
    this.logs = []
  }

  public logsToBlob() {
    const blob = new Blob(this.logs, { type: 'application/json' })
    return blob;
  }

  public downloadLogsBlobInBrowser() {
    const url = URL.createObjectURL(this.logsToBlob());
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'logs.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
}
