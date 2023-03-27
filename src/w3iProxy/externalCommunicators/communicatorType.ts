export interface ExternalCommunicator {
  postToExternalProvider: <TReturn>(methodName: string, ...params: unknown[]) => Promise<TReturn>
}
